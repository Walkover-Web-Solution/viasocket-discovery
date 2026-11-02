# AGENTS.md

viaSocket Discovery: a Next.js 14 app (pages router, `basePath: '/discovery'`). Code lives in `src/`, `lib/` and `models/`. File-based compare pages live in `content/compare/` (see `README.md`).

## Checks

- `npm run lint`
- `npm run status:check`: fails when code changed against the base branch but `STATUS.md` did not. Also runs on every PR.

## Keep STATUS.md current

`STATUS.md` is the progress scorecard. Every change to a feature, screen, rule, table or decision updates `STATUS.md` in the same change:

1. the affected row (status and notes),
2. a change-log line (`date · who · what · status effect`, newest first),
3. the "Reviewed up to commit" hash.

`npm run status:check` lists the commits that touched code since that hash. If teammates changed code without updating `STATUS.md`, review those commits and update it for them.

Base statuses on code you have read. Built but not checked with real people is 🟡, never ✅. If a change truly has no status effect, put `[no status]` in a commit message.
