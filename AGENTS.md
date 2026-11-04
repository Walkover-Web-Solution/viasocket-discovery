# AGENTS.md

## Progress tracker

Every change to a feature, screen, rule, table or decision updates STATUS.md in the same change (the row, a change-log line, and the "Reviewed up to commit" hash). Update it for teammates who didn't.

`npm run status:check` enforces that for `src/`, `lib/`, `models/`, and `scripts/`. A commit message containing `[no status]` waives the failure for committed changes. The command still lists every commit that touched those directories after the reviewed hash.
