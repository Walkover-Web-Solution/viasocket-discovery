#!/usr/bin/env node
// Fails when code changed against the base branch but STATUS.md did not,
// unless a commit on the branch says "[no status]". Always lists commits that
// touched code since STATUS.md's "Reviewed up to commit" hash.
//
// Base branch: STATUS_BASE_REF, else origin/$GITHUB_BASE_REF (set on pull
// requests), else origin/main, else main. Local runs also count uncommitted
// and untracked files.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const STATUS_FILE = 'STATUS.md';
const CODE_PATHS = ['src/', 'lib/', 'models/', 'next.config.js', 'next.config.mjs'];
const OPT_OUT = '[no status]';

const git = (...args) =>
  execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

const tryGit = (...args) => {
  try {
    return git(...args);
  } catch {
    return null;
  }
};

const lines = (text) => (text ? text.split('\n').filter(Boolean) : []);

const isCode = (file) =>
  CODE_PATHS.some((p) => (p.endsWith('/') ? file.startsWith(p) : file === p));

function resolveBase() {
  const candidates = [
    process.env.STATUS_BASE_REF,
    process.env.GITHUB_BASE_REF && `origin/${process.env.GITHUB_BASE_REF}`,
    'origin/main',
    'main',
  ].filter(Boolean);
  for (const ref of candidates) {
    if (tryGit('rev-parse', '--verify', '--quiet', `${ref}^{commit}`)) return ref;
  }
  return null;
}

function listReviewedSince() {
  if (!existsSync(STATUS_FILE)) return;
  const match = readFileSync(STATUS_FILE, 'utf8').match(
    /\*\*Reviewed up to commit:\*\*\s*`([0-9a-f]{7,40})`/i,
  );
  if (!match) {
    console.warn(`warning: ${STATUS_FILE} has no "**Reviewed up to commit:** \`<hash>\`" header.`);
    return;
  }
  const reviewed = match[1];
  if (!tryGit('rev-parse', '--verify', '--quiet', `${reviewed}^{commit}`)) {
    console.warn(
      `warning: reviewed commit ${reviewed} is not in this checkout (shallow clone, or rewritten history). Set it to a commit on the base branch.`,
    );
    return;
  }
  const log = lines(
    git('log', '--date=short', '--format=%h %ad %an: %s', `${reviewed}..HEAD`, '--', ...CODE_PATHS),
  ).map((l) => `  ${l}`);
  if (log.length === 0) {
    console.log(`No commits touched code since the reviewed commit ${reviewed}.`);
  } else {
    console.log(`Commits that touched code since the reviewed commit ${reviewed} (${log.length}):`);
    console.log(log.join('\n'));
    console.log(`Review them in ${STATUS_FILE}, then move the "Reviewed up to commit" hash.`);
  }
}

function main() {
  if (!tryGit('rev-parse', '--git-dir')) {
    console.error('status:check must run inside a git checkout.');
    process.exit(2);
  }

  listReviewedSince();
  console.log('');

  const base = resolveBase();
  if (!base) {
    console.error(
      'status:check: no base branch found. Fetch it (CI needs fetch-depth: 0) or set STATUS_BASE_REF.',
    );
    process.exit(2);
  }
  const mergeBase = tryGit('merge-base', base, 'HEAD');
  if (!mergeBase) {
    console.error(`status:check: HEAD shares no history with ${base}. CI needs fetch-depth: 0.`);
    process.exit(2);
  }

  const changed = new Set([
    ...lines(git('diff', '--name-only', mergeBase)),
    ...lines(git('ls-files', '--others', '--exclude-standard')),
  ]);
  const codeChanged = [...changed].filter(isCode).sort();

  if (codeChanged.length === 0) {
    console.log(`OK: no code changed against ${base}.`);
    return;
  }
  if (changed.has(STATUS_FILE)) {
    console.log(`OK: ${codeChanged.length} code file(s) changed against ${base}, and ${STATUS_FILE} was updated.`);
    return;
  }
  const optOut = lines(git('log', '--format=%h %s', `${mergeBase}..HEAD`, `--grep=${OPT_OUT}`, '--fixed-strings'));
  if (optOut.length > 0) {
    console.log(`OK: code changed without a ${STATUS_FILE} update, opted out by:`);
    console.log(optOut.map((l) => `  ${l}`).join('\n'));
    return;
  }

  console.error(`FAIL: code changed against ${base} but ${STATUS_FILE} did not:`);
  console.error(codeChanged.map((f) => `  ${f}`).join('\n'));
  console.error(
    `\nUpdate ${STATUS_FILE} in the same change: the affected row, a change-log line, and the "Reviewed up to commit" hash.` +
      `\nIf the change truly has no status effect, put "${OPT_OUT}" in a commit message.`,
  );
  process.exit(1);
}

main();
