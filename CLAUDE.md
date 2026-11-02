# CLAUDE.md

Read `AGENTS.md` first; it is the agent guide for this repo.

## Keep STATUS.md current

Every change to a feature, screen, rule, table or decision updates `STATUS.md` in the same change: the affected row, a change-log line, and the "Reviewed up to commit" hash. If teammates changed code without updating it, update it for them; `npm run status:check` lists the commits that touched code since that hash.
