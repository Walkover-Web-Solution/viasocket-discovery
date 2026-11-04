#!/usr/bin/env node
/**
 * Fail when code directories changed against the base branch but STATUS.md
 * did not. A commit message containing "[no status]" waives that for
 * committed changes only. Always list commits that touched code after the
 * "Reviewed up to commit" hash in STATUS.md.
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

function namesAgainstBase(base) {
  return lines(
    git(["diff", "--name-only", `${base}...HEAD`, "--", ...CODE_DIRS, STATUS_FILE]),
  );
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

function committedMessages(base) {
  const out = git(["log", "--format=%B%x1e", `${base}..HEAD`]);
  return out.split("\x1e").map((message) => message.trim()).filter(Boolean);
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

  let committed = [];
  try {
    committed = namesAgainstBase(base);
  } catch (error) {
    console.error(`status check failed: could not diff against ${base}.`);
    console.error(error.stderr?.toString?.() || error.message);
    process.exit(1);
  }

  const dirty = namesAgainstHead();
  const codeCommitted = committed.filter(isCodePath);
  const codeDirty = [...new Set(dirty.filter(isCodePath))];
  const statusCommitted = committed.some(isStatusPath);
  const statusDirty = dirty.some(isStatusPath);

  const waiver = committedMessages(base).some((message) => message.includes(WAIVER));

  const failures = [];
  if (codeCommitted.length > 0 && !statusCommitted && !waiver) {
    failures.push(
      `Code committed since ${base} changed and ${STATUS_FILE} did not. Commit messages do not contain ${WAIVER}.`,
    );
    for (const file of codeCommitted) failures.push(`  ${file}`);
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
