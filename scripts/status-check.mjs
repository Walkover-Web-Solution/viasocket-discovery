#!/usr/bin/env node
// Fails when code changed against the base branch but STATUS.md did not,
// unless a commit on the branch says "[no status]". Always lists commits that
// touched code since the "Reviewed up to commit" hash in STATUS.md.
//
// Env overrides:
//   STATUS_BASE_REF   base to compare against (default: origin/$GITHUB_BASE_REF, else origin/HEAD, else origin/main)
//   STATUS_CODE_DIRS  space-separated code paths (default: "src/ lib/ models/")

import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

const STATUS_FILE = 'STATUS.md';
const OPT_OUT = '[no status]';
const CODE_DIRS = (process.env.STATUS_CODE_DIRS || 'src/ lib/ models/').split(/\s+/).filter(Boolean);

function git(args, { allowFail = false } = {}) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    if (allowFail) return null;
    throw err;
  }
}

function resolveBase() {
  if (process.env.STATUS_BASE_REF) return process.env.STATUS_BASE_REF;
  if (process.env.GITHUB_BASE_REF) return `origin/${process.env.GITHUB_BASE_REF}`;
  const head = git(['symbolic-ref', '--quiet', 'refs/remotes/origin/HEAD'], { allowFail: true });
  if (head) return head.replace(/^refs\/remotes\//, '');
  return 'origin/main';
}

const isCode = (file) => CODE_DIRS.some((dir) => file === dir.replace(/\/$/, '') || file.startsWith(dir.endsWith('/') ? dir : `${dir}/`));
const lines = (out) => (out ? out.split('\n').filter(Boolean) : []);

const base = resolveBase();
if (!git(['rev-parse', '--verify', '--quiet', `${base}^{commit}`], { allowFail: true })) {
  console.error(`status:check: base ref "${base}" not found. Fetch it (CI needs fetch-depth: 0) or set STATUS_BASE_REF.`);
  process.exit(2);
}
const mergeBase = git(['merge-base', base, 'HEAD']);

// Committed, staged, unstaged and untracked changes since the merge base.
const changed = new Set([
  ...lines(git(['diff', '--name-only', mergeBase])),
  ...lines(git(['ls-files', '--others', '--exclude-standard'])),
]);
const codeChanged = [...changed].filter(isCode);
const statusChanged = changed.has(STATUS_FILE);
const optOutCommits = lines(git(['log', '--format=%h %s', '--fixed-strings', `--grep=${OPT_OUT}`, `${mergeBase}..HEAD`]));

console.log(`status:check: base ${base} (merge-base ${mergeBase.slice(0, 7)}), code dirs: ${CODE_DIRS.join(' ')}`);

// Report: code commits since the last review recorded in STATUS.md.
if (!existsSync(STATUS_FILE)) {
  console.error(`status:check: ${STATUS_FILE} is missing.`);
  process.exit(1);
}
const reviewed = readFileSync(STATUS_FILE, 'utf8').match(/\*\*Reviewed up to commit:\*\*\s*`([0-9a-f]{7,40})`/i)?.[1];
if (!reviewed) {
  console.warn(`status:check: no "**Reviewed up to commit:** \`<hash>\`" found in ${STATUS_FILE}.`);
} else if (!git(['rev-parse', '--verify', '--quiet', `${reviewed}^{commit}`], { allowFail: true })) {
  console.warn(`status:check: reviewed commit ${reviewed} is not in this clone's history (shallow fetch?).`);
} else {
  const unreviewed = lines(git(['log', '--format=%h %ad %an  %s', '--date=short', `${reviewed}..HEAD`, '--', ...CODE_DIRS]));
  console.log(`\nCommits touching code since reviewed commit ${reviewed.slice(0, 7)}: ${unreviewed.length}`);
  unreviewed.forEach((line) => console.log(`  ${line}`));
}

console.log('');
if (codeChanged.length === 0) {
  console.log('PASS: no code changes against the base branch.');
} else if (statusChanged) {
  console.log(`PASS: ${codeChanged.length} code file(s) changed and ${STATUS_FILE} was updated.`);
} else if (optOutCommits.length) {
  console.log(`PASS: ${STATUS_FILE} not updated, but opted out by: ${optOutCommits.join('; ')}`);
} else {
  console.error(`FAIL: code changed but ${STATUS_FILE} did not. Changed code files:`);
  codeChanged.forEach((file) => console.error(`  ${file}`));
  console.error(`Update ${STATUS_FILE} (row, change-log line, "Reviewed up to commit" hash), or put "${OPT_OUT}" in a commit message.`);
  process.exit(1);
}
