# Documentation maintenance

The weekly docs run starts here. **Reviewed revision:** `7cab049` (main, 2026-11-08, first run). The next run reviews `git log 7cab049..HEAD` plus the "Unfinished" list below.

## Coverage map

Status: **verified** means checked against code or by running it. **partial** means some of it is documented and gaps are named. **missing** means it needs a source or a decision. **n/a** means not applicable.

| Topic | Authoritative location | Status | Evidence / gap |
| --- | --- | --- | --- |
| Agent rules and progress tracker | [AGENTS.md](../AGENTS.md), [STATUS.md](../STATUS.md) | verified | `npm run status:check` passed. `CLAUDE.md` defers to AGENTS.md. |
| Product purpose, ICP, vision, non-goals, success measures | — | missing | There is no VISION.md or plan (see STATUS.md open question 1). It needs an owner to write one. The code shows the features, not the intent. |
| Feature inventory | [STATUS.md](../STATUS.md) "Beyond the plan" | partial | Rows exist. None is ✅ (not exercised with real sessions). |
| Architecture, routes, data model, integrations | [architecture.md](architecture.md) | verified | Read from the code. Base path checked in the build manifest. |
| Compare page authoring and SEO routes | [README → Compare pages](../README.md#compare-pages) | verified | Built and served locally. All 13 routes prerendered. |
| Setup, commands, tests | [development.md](development.md) | verified | build, start, lint, and status:check run. dev and build:production not run. |
| Security, trust boundaries, secrets | [security-and-operations.md](security-and-operations.md) | partial | Findings are recorded. Spoofing `x-profile` was not tested. Gateway protection is unknown. |
| Performance and caching | [security-and-operations.md](security-and-operations.md#performance-and-caching) | partial | Behavior is described. No budgets exist. |
| Website SEO (sitemap, robots, canonicals, JSON-LD, llms.txt) | [security-and-operations.md](security-and-operations.md#seo-surface), README | partial | Host-level robots.txt is not confirmed. Blogs are not in the sitemap; whether that is intended is unknown. |
| Marketing: audience, claims, CTAs, competitor evidence | — | missing | No approved source in the repo. Compare articles carry their own dated claims in `content/compare/*/body.html`. |
| Design system and accessibility | [architecture.md → UI stack](architecture.md#ui-stack) | missing | No tokens, brand rules, or accessibility standard exist. Needs a design owner. |
| Measurement and experiments | — | missing | Only GTM/GA load, in prod (`src/pages/_app.js`). No event definitions and no experiment framework. |
| Deployment, CI, health, rollback | [security-and-operations.md](security-and-operations.md#deployment-and-operations) | partial | Dockerfile and CI are verified. The deploy target, secret injection, and rollback are not in the repo. |
| Backend: validation, idempotency, retries, migrations | architecture.md, security-and-operations.md | partial | Joi validates AI output only. No migrations tree. No idempotency. |
| Agent access to the product (llms.txt) | README, `src/pages/llms.txt.js` | verified | `llms.txt` lists compare pages only. No API or MCP for agents. |
| CLI/SDK, infrastructure as code, data pipelines | — | n/a | None in this repo. |

## Code findings for owners (not fixed by docs)

1. Write routes are not gated, `POST /api/users` mints tokens, and `x-profile` may be trusted from the client. See [security](security-and-operations.md#trust-boundaries).
2. `.env.local` and `.env.production` are committed.
3. `createBlog()` in `src/pages/api/ask-ai.js` passes an undefined `errorMessage` to `retryResponse`. When the blueprint fails validation, this throws a `ReferenceError` instead of retrying.
4. `sync-apps`, `update-blogs`, and `improve/[id]` fall through to a second response.
5. `meta.json` files carry `h1`, and nothing reads it. `readMinutes` is read but was not documented (now in the README).
6. `build:test` needs a missing `.env.test`.

## Unfinished (next run)

- Confirm with owners: the gateway or auth in front of the ungated routes; the host-level `robots.txt`; the deploy target and rollback; and whether blogs belong in the sitemap.
- Test whether a client-sent `x-profile` header reaches API routes. This needs a local server with Mongo.
- Not reviewed in depth: individual components under `src/components/`, `src/services/blogServices.js` query details, and `src/utils/schema.js` field-by-field.
- When a VISION.md or plan appears, add product coverage and link it from AGENTS.md.

## Run log

- 2026-11-08 · First run at `7cab049`. Added AGENTS.md task map, `docs/architecture.md`, `docs/development.md`, `docs/security-and-operations.md`, and this file. Corrected README boilerplate and compare fields.
