# Claude guide

See `AGENTS.md`. The rule that matters most:

Every change to a feature, screen, rule, table or decision updates `STATUS.md` in the same change: the affected row, a change-log line, and the `**Reviewed up to commit:**` hash. If teammates changed code without updating it, update it for them. `npm run status:check` enforces this on PRs.
