#!/usr/bin/env node
/**
 * Fail when a commit since the base branch touches a code directory and does
 * not touch STATUS.md, unless that commit message contains "[no status]".
 * Uncommitted code fails too, and the waiver does not cover it.
 * Always list commits that touched code after the "Reviewed up to commit"
 * hash in STATUS.md.
 *
 * Watched directories: src/, lib/, models/, scripts/.
 * There is no migrations/ directory in this repo. content/ is not watched:
 * README says a new compare page is a new folder and does not need a code change.
 *
 * Base ref: STATUS_BASE_REF, else origin/$GITHUB_BASE_REF, else origin/main, else main.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CODE_DIRS = ["src", "lib", "models", "scripts"];
const STATUS_FILE = "STATUS.md";
const WAIVER = "[no status]";

function git(args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function tryGit(args) {
  try {
    return git(args).trim();
  } catch {
    return null;
  }
}

function lines(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function resolveBase() {
  const candidates = [];
  if (process.env.STATUS_BASE_REF) candidates.push(process.env.STATUS_BASE_REF);
  if (process.env.GITHUB_BASE_REF) {
    candidates.push(`origin/${process.env.GITHUB_BASE_REF}`);
    candidates.push(process.env.GITHUB_BASE_REF);
  }
  candidates.push("origin/main", "main");

  for (const candidate of candidates) {
    if (tryGit(["rev-parse", "--verify", "--quiet", `${candidate}^{commit}`])) {
      return candidate;
    }
  }
  return null;
}

function namesAgainstHead() {
  const tracked = lines(git(["diff", "--name-only", "HEAD", "--", ...CODE_DIRS, STATUS_FILE]));
  const untracked = lines(
    git(["ls-files", "--others", "--exclude-standard", "--", ...CODE_DIRS, STATUS_FILE]),
  );
  return [...tracked, ...untracked];
}

function isCodePath(file) {
  return CODE_DIRS.some((dir) => file === dir || file.startsWith(`${dir}/`));
}

function isStatusPath(file) {
  return file === STATUS_FILE;
}

function readReviewedHash() {
  const statusPath = path.join(process.cwd(), STATUS_FILE);
  if (!fs.existsSync(statusPath)) {
    return { error: `${STATUS_FILE} is missing.` };
  }
  const text = fs.readFileSync(statusPath, "utf8");
  const match = text.match(/Reviewed up to commit:\*\*\s*`([0-9a-fA-F]{7,40})`/);
  if (!match) {
    return {
      error: `${STATUS_FILE} has no "Reviewed up to commit" hash in the header.`,
    };
  }
  const resolved = tryGit(["rev-parse", "--verify", "--quiet", `${match[1]}^{commit}`]);
  if (!resolved) {
    return { error: `Reviewed commit ${match[1]} is not in this repository.` };
  }
  return { hash: resolved, written: match[1] };
}

function listCodeCommits(hash) {
  const out = git([
    "log",
    "--format=%h %s",
    `${hash}..HEAD`,
    "--",
    ...CODE_DIRS,
  ]);
  return lines(out);
}

function isMerge(hash) {
  const line = tryGit(["rev-list", "--parents", "-n", "1", hash]);
  if (!line) return false;
  return line.split(/\s+/).length > 2;
}

function commitsSince(base) {
  const hashes = lines(git(["rev-list", "--reverse", `${base}..HEAD`]));
  return hashes.filter((hash) => !isMerge(hash)).map((hash) => {
    const names = lines(git(["diff-tree", "--no-commit-id", "--name-only", "-r", hash]));
    const subject = git(["log", "-1", "--format=%h %s", hash]).trim();
    const message = git(["log", "-1", "--format=%B", hash]);
    return { hash, subject, message, names };
  });
}

function main() {
  const base = resolveBase();
  if (!base) {
    console.error(
      "status check failed: could not resolve a base branch. Set STATUS_BASE_REF.",
    );
    process.exit(1);
  }

  const reviewed = readReviewedHash();
  if (reviewed.hash) {
    const commits = listCodeCommits(reviewed.hash);
    console.log(`Commits that touched code since ${reviewed.hash}:`);
    if (commits.length === 0) {
      console.log("(none)");
    } else {
      for (const commit of commits) console.log(commit);
    }
  } else {
    console.error(reviewed.error);
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

  const dirty = namesAgainstHead();
  const codeDirty = [...new Set(dirty.filter(isCodePath))];
  const statusDirty = dirty.some(isStatusPath);

  const failures = [];
  for (const commit of commits) {
    const code = commit.names.filter(isCodePath);
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
