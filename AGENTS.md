# Agent guide

Next.js (pages router) app served under `/automation-ideas`. Code lives in `src/`, `lib/`, `models/`.

## Keep STATUS.md current

Every change to a feature, screen, rule, table or decision updates `STATUS.md` in the same change:

1. the affected row (status + notes, based on the code; built but unchecked is 🟡, never ✅),
2. a change-log line (newest first: `date · who · what · status effect`),
3. the `**Reviewed up to commit:**` hash.

If teammates changed code without updating it, update it for them. `npm run status:check` lists code commits since the reviewed hash and fails a PR that changes code without touching `STATUS.md`; use `[no status]` in a commit message only for changes with no status effect.
