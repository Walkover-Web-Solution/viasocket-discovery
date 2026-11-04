#!/usr/bin/env node
/**
 * Fails when code changed against the base branch and STATUS.md did not,
 * unless a commit on this branch says "[no status]". That waiver covers
 * committed changes only. A dirty code file still fails until STATUS.md
 * is dirty too. Always lists commits that touched code after the
 * "Reviewed up to commit" hash in STATUS.md.
 *
 * Code paths: src/, lib/, models/, scripts/. There is no migrations/ tree.
 * content/ is not code. Override the base with STATUS_BASE_REF.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

const STATUS_FILE = "STATUS.md";
const CODE_DIRS = ["src", "lib", "models", "scripts"];

function git(args) {
  return execFileSync("git", ["-c", "core.quotepath=false", ...args], {
    encoding: "utf8",
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
  return text.split("\n").filter((line) => line.trim() !== "");
}

function isCodePath(file) {
  const normalized = file.replace(/\\/g, "/").replace(/^\.\//, "");
  return CODE_DIRS.some(
    (dir) => normalized === dir || normalized.startsWith(`${dir}/`),
  );
}

function changedPaths(args) {
  const output = tryGit(args);
  const paths = [];
  for (const line of lines(output)) {
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
    if (!tryGit(["rev-parse", "--verify", `${ref}^{commit}`])) {
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
    if (tryGit(["rev-parse", "--verify", `${ref}^{commit}`])) return ref;
  }
  return null;
}

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
if (!tryGit(["rev-parse", "--verify", `${reviewed}^{commit}`])) {
  console.error(
    `Reviewed up to commit \`${reviewed}\` is not in this repository.`,
  );
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
console.log(codeLog && codeLog.length ? codeLog : "(none)");

const base = resolveBase();
if (!base) {
  console.error(
    "Could not resolve a base branch. Set STATUS_BASE_REF, or fetch origin/main.",
  );
  process.exit(1);
}

const committed = changedPaths([
  "diff",
  "--name-status",
  "-M",
  `${base}...HEAD`,
]);
const work = unique([
  ...changedPaths(["diff", "--name-status", "-M", "HEAD"]),
  ...changedPaths(["diff", "--name-status", "-M", "--cached"]),
  ...lines(tryGit(["ls-files", "--others", "--exclude-standard"])),
]);

const committedCode = unique(committed.filter(isCodePath));
const workCode = unique(work.filter(isCodePath));
const committedStatus = committed.includes(STATUS_FILE);
const workStatus = work.includes(STATUS_FILE);
const messages = tryGit(["log", `${base}..HEAD`, "--format=%B"]) || "";
const exempt = messages.includes("[no status]");

let failed = false;

if (committedCode.length && !committedStatus && !exempt) {
  failed = true;
  console.error(
    `Code changed against ${base} and ${STATUS_FILE} did not (commit message may include "[no status]" to waive this):`,
  );
  for (const file of committedCode) console.error(`  ${file}`);
}

if (workCode.length && !workStatus) {
  failed = true;
  console.error(
    `Uncommitted code change without a ${STATUS_FILE} update:`,
  );
  for (const file of workCode) console.error(`  ${file}`);
}

if (failed) process.exit(1);

console.log("status check passed");
