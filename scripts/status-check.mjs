#!/usr/bin/env node
/**
 * Fail when a commit since the base branch touches a code directory and does
 * not touch STATUS.md, unless that commit message contains "[no status]".
 * One waiver does not cover a different commit. Uncommitted code fails too,
 * and the waiver does not cover it.
 * Always list commits that touched code after the "Reviewed up to commit"
 * hash in STATUS.md.
 *
 * Watched directories: src/, lib/, models/, scripts/.
 * There is no migrations/ directory. content/ is not watched.
 * Rename and copy detection is on, so a renamed code file still counts.
 * Base ref: STATUS_BASE_REF (must resolve), else origin/$GITHUB_BASE_REF,
 * else origin/main, else main.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const CODE_DIRS = ["src", "lib", "models", "scripts"];
const STATUS_FILE = "STATUS.md";
const WAIVER = "[no status]";

function git(args) {
  return execFileSync("git", ["-c", "core.quotepath=false", ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function tryGit(args) {
  try {
    return git(args);
  } catch {
    return null;
  }
}

function lines(text) {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalize(file) {
  return file.replace(/\\/g, "/").replace(/^\.\//, "");
}

function isCodePath(file) {
  const normalized = normalize(file);
  return CODE_DIRS.some(
    (dir) => normalized === dir || normalized.startsWith(`${dir}/`),
  );
}

function isStatusPath(file) {
  return normalize(file) === STATUS_FILE;
}

function changedPaths(args) {
  const paths = [];
  for (const line of lines(tryGit(args))) {
    const parts = line.split("\t");
    const status = parts[0] || "";
    if (status.startsWith("R") || status.startsWith("C")) {
      if (parts[1]) paths.push(parts[1]);
      if (parts[2]) paths.push(parts[2]);
    } else if (parts[1]) {
      paths.push(parts[1]);
    }
  }
  return paths;
}

function unique(paths) {
  return [...new Set(paths)];
}

function resolveBase() {
  if (process.env.STATUS_BASE_REF) {
    const ref = process.env.STATUS_BASE_REF;
    if (!tryGit(["rev-parse", "--verify", "--quiet", `${ref}^{commit}`])) {
      console.error(`STATUS_BASE_REF does not resolve to a commit: ${ref}`);
      process.exit(1);
    }
    return ref;
  }

  const candidates = [];
  if (process.env.GITHUB_BASE_REF) {
    candidates.push(`origin/${process.env.GITHUB_BASE_REF}`);
    candidates.push(process.env.GITHUB_BASE_REF);
  }
  candidates.push("origin/main", "main");

  for (const ref of candidates) {
    if (tryGit(["rev-parse", "--verify", "--quiet", `${ref}^{commit}`])) return ref;
  }
  return null;
}

function isMerge(hash) {
  const line = tryGit(["rev-list", "--parents", "-n", "1", hash]);
  if (!line) return false;
  return line.split(/\s+/).length > 2;
}

function commitsSince(base) {
  const hashes = lines(tryGit(["rev-list", "--reverse", `${base}..HEAD`]));
  return hashes.filter((hash) => !isMerge(hash)).map((hash) => {
    const names = changedPaths([
      "diff-tree",
      "--no-commit-id",
      "--name-status",
      "-M",
      "-r",
      hash,
    ]);
    const subject = git(["log", "-1", "--format=%h %s", hash]);
    const message = git(["log", "-1", "--format=%B", hash]);
    return { hash, subject, message, names };
  });
}

function main() {
  if (!existsSync(STATUS_FILE)) {
    console.error(`${STATUS_FILE} is missing.`);
    process.exit(1);
  }

  const statusText = readFileSync(STATUS_FILE, "utf8");
  const reviewedMatch = statusText.match(
    /\*\*Reviewed up to commit:\*\*\s*`([0-9a-fA-F]{7,40})`/,
  );
  if (!reviewedMatch) {
    console.error(
      'STATUS.md has no "**Reviewed up to commit:** `<hash>`" header.',
    );
    process.exit(1);
  }

  const reviewed = reviewedMatch[1];
  if (!tryGit(["rev-parse", "--verify", "--quiet", `${reviewed}^{commit}`])) {
    console.error(`Reviewed up to commit \`${reviewed}\` is not in this repository.`);
    process.exit(1);
  }

  const reviewedFull = git(["rev-parse", `${reviewed}^{commit}`]);
  const codeLog = tryGit([
    "log",
    "--format=%h %s",
    `${reviewedFull}..HEAD`,
    "--",
    ...CODE_DIRS,
  ]);

  console.log(`Reviewed up to commit: ${reviewedFull}`);
  console.log("Commits that touched code since that commit:");
  console.log(codeLog ? codeLog : "(none)");

  const base = resolveBase();
  if (!base) {
    console.error(
      "status check failed: could not resolve a base branch. Set STATUS_BASE_REF.",
    );
    process.exit(1);
  }

  let commits = [];
  try {
    commits = commitsSince(base);
  } catch (error) {
    console.error(`status check failed: could not read commits since ${base}.`);
    console.error(error.stderr?.toString?.() || error.message);
    process.exit(1);
  }

  const dirty = unique([
    ...changedPaths(["diff", "--name-status", "-M", "HEAD", "--", ...CODE_DIRS, STATUS_FILE]),
    ...changedPaths([
      "diff",
      "--name-status",
      "-M",
      "--cached",
      "--",
      ...CODE_DIRS,
      STATUS_FILE,
    ]),
    ...lines(
      tryGit(["ls-files", "--others", "--exclude-standard", "--", ...CODE_DIRS, STATUS_FILE]),
    ),
  ]);
  const codeDirty = dirty.filter(isCodePath);
  const statusDirty = dirty.some(isStatusPath);

  const failures = [];
  for (const commit of commits) {
    const code = unique(commit.names.filter(isCodePath));
    const status = commit.names.some(isStatusPath);
    if (code.length > 0 && !status && !commit.message.includes(WAIVER)) {
      failures.push(
        `${commit.subject} changed code and did not change ${STATUS_FILE}. The message does not contain ${WAIVER}.`,
      );
      for (const file of code) failures.push(`  ${file}`);
    }
  }
  if (codeDirty.length > 0 && !statusDirty) {
    failures.push(
      `Uncommitted code changed and ${STATUS_FILE} did not. ${WAIVER} applies to commit messages only.`,
    );
    for (const file of codeDirty) failures.push(`  ${file}`);
  }

  if (failures.length > 0) {
    console.error("status check failed.");
    for (const line of failures) console.error(line);
    console.error(
      `Update ${STATUS_FILE} in this change (the row, a change-log line, and the reviewed hash), or include ${WAIVER} in the commit message for a committed code change.`,
    );
    process.exit(1);
  }

  console.log(`status check passed (base ${base}).`);
}

main();
