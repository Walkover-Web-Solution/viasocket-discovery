# Documentation maintenance

Weekly docs maintenance starts here. **Reviewed revision:** `9e85766` (`automation-ideas`, 2026-11-22, first run on this branch). Next run: `git log 9e85766..HEAD` plus the Unfinished list below.

`main` on this repository carries a separate docs set for the `/discovery` product (compare pages, different `AGENTS.md`). Do not assume paths or constraints from `main` apply here without checking this branch.

## Coverage map

Status: **verified** = checked against code or by running commands. **partial** = gaps named. **missing** = needs owner/source. **n/a** = not applicable.

| Topic | Authoritative location | Status | Evidence / gap |
| --- | --- | --- | --- |
| Agent rules and progress tracker | [AGENTS.md](../AGENTS.md), [STATUS.md](../STATUS.md) | verified | `npm run status:check` passed; `CLAUDE.md` defers to AGENTS.md |
| Product purpose, ICP, vision, non-goals | — | missing | No VISION.md or plan (STATUS.md open question 1) |
| Feature inventory | [STATUS.md](../STATUS.md) | partial | Rows exist; none marked ✅ |
| Architecture, routes, data, integrations | [architecture.md](architecture.md) | verified | Read from code at `9e85766` |
| Use case + blog flows | architecture.md, STATUS.md | partial | Batch job triggers not in repo |
| Setup, commands, verification | [development.md](development.md) | verified | lint + build run 2026-11-22; dev/start not run |
| Security, secrets, auth | [security-and-operations.md](security-and-operations.md) | partial | `x-profile` spoofing not tested; gateway unknown |
| Performance and caching | security-and-operations.md | partial | Described; no budgets |
| Website SEO (sitemap, robots, llms) | security-and-operations.md | missing | No sitemap/robots routes on branch; intent unknown |
| Marketing, claims, CTAs | — | missing | No approved copy source; Razorpay page is static demo data |
| Design and accessibility | architecture.md § UI stack | missing | No design tokens or a11y standard |
| Measurement and experiments | README § Experiments, `experiments.js` | partial | Infra present; GTM in prod; no active experiment |
| Deployment, CI, health | security-and-operations.md | partial | Dockerfile + status CI verified; deploy target unknown |
| Compare pages / file CMS | — | n/a | Not on `automation-ideas` branch |
| Agent access (llms.txt, MCP) | — | n/a | None in repo |

## Code findings for owners (not fixed by docs)

1. Ungated batch and AI routes; possible `x-profile` trust issue — see [security](security-and-operations.md#trust-boundaries).
2. `.env.local` / `.env.production` committed (public vars only in files inspected; policy still risky).
3. Middleware allows `PATCH` on `/api/usecases` but no PATCH handler exists.
4. `update-usecases` early-200 pattern may fall through to 405.
5. `build:test` requires missing `.env.test`.

## Unfinished (next run)

- Owner input: product vision (VISION.md or plan link for STATUS.md).
- Confirm host SEO strategy for use case URLs (sitemap, canonicals).
- Test client `x-profile` behavior with a running server and Mongo.
- Deeper pass: `usecaseServices.js` query edge cases, component-level UI patterns.
- When code changes land after `9e85766`, refresh architecture tables (experiments adoption, new routes).

## Run log

- 2026-11-22 · First run on `automation-ideas` at `9e85766`. Added `docs/*`, expanded `AGENTS.md`, replaced README boilerplate (kept Experiments section).