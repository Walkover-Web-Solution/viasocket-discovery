# Agent notes

## STATUS.md

Every change to a feature, screen, rule, table, or decision updates `STATUS.md` in the same change:

- the row for what changed
- a change-log line (`date · who · what · status effect`)
- the `Reviewed up to commit` hash

Update `STATUS.md` for teammates who didn't.

`npm run status:check` fails when a commit since the base branch touches `src/`, `lib/`, `models/`, or `scripts/` and does not touch `STATUS.md` in that same commit. A commit message that contains `[no status]` waives that commit. Uncommitted code fails too, and the waiver does not cover it. Renames count. The command always lists commits that touched those directories after the reviewed hash.

`content/compare/` is not part of that check. A new compare article is still a screen, so update `STATUS.md` for it anyway.
