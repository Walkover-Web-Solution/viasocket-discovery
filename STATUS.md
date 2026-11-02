# STATUS

**Plan:** none supplied (the request that created this file left the plan link as a placeholder; no plan document exists in the repo) · **Last updated:** 2026-11-02 · **Reviewed up to commit:** `436ace8d71da09991435f6477610a554a2922501`

Legend: ✅ works for real people · 🟡 built, not proven · ⛔ blocked · ⬜ not started · 🙈 hidden · ❌ dropped

Rules: every status rests on code in the repo. Built but unchecked is 🟡, never ✅. "Reviewed up to commit" is the last commit whose code changes this file reflects (normally the parent of the commit that edits this file). `npm run status:check` enforces updates; see `AGENTS.md`.

## At a glance

| Area | Status | Notes |
| --- | --- | --- |
| Plan scorecard | ⛔ | No plan to score against. Phases, scope items and must-pass tests are empty until a plan is linked above. |
| Code inventory | 🟡 | Everything found in `src/`, `lib/`, `models/` is listed under "Beyond the plan". Nothing is marked ✅: no tests or usage evidence in the repo. |
| Status tracking | 🟡 | `scripts/status-check.mjs` + `.github/workflows/status-check.yml`. Verified locally; not yet seen running on a PR. |

## Phases

No plan, so no phases. Add one row per plan phase: Phase | Status | Notes.

## Scope items

No plan sections to tabulate. Add one table per plan section (Item | Status | Notes) and move matching rows out of "Beyond the plan".

## Must-pass tests

The repo has no test suite (`package.json` has `lint` and `status:check` only).

| Test | Status | Notes |
| --- | --- | --- |
| `npm run status:check` | 🟡 | Passes on a clean tree, fails when a code file changes without this file (checked locally 2026-11-02). |
| `npm run lint` | 🟡 | Defined in `package.json`; not run while creating this file (dependencies not installed). |

## Open questions

1. Which plan does this file score against? Link it in the header.
2. Are `src/`, `lib/`, `models/` the right code dirs for the check? (`STATUS_CODE_DIRS` overrides.)
3. `src/middleware.js` only guards `/api/blog`, `/api/ask-ai`, `/api/gethistory`, `/api/usecases`. Batch/sync endpoints (`sync-apps`, `update-blogs`, `update-usecases`, `improve-blogs`, `mongo-to-dbdash`, `udpate-blog-from-db-dash`) are not in that list. Are they meant to be public, or protected elsewhere? Not confirmed either way.

## Beyond the plan

Everything below exists in code; with no plan, none of it can be placed in one.

| Item | Status | Notes |
| --- | --- | --- |
| Home page (popular users, search) | 🟡 | `src/pages/index.js`; served under `basePath: '/automation-ideas'` (`next.config.mjs`). |
| Blog pages + related blogs + tags | 🟡 | `src/pages/blog/[...blogId]`, `api/blog*`, `api/related-blogs`, `api/tags`; `models/BlogModel.js`, `models/tagsModel.js`. |
| Blog comments | 🟡 | `api/blog/[blogId]/comments`. |
| AI chat / blog generation and editing | 🟡 | `src/pages/edit/[chatId]`, `api/ask-ai.js` (auth required), `api/ai.js`, `api/gethistory.js`. |
| App use-case pages ("<app> automation ideas") | 🟡 | `src/pages/usecase/[...usecaseId]`, `api/usecases*`, `models/UsecaseModel.js`. |
| Use-case comments | 🟡 | `api/usecases/[usecaseId]/comments`. |
| User profile pages | 🟡 | `src/pages/user/[...userId].js`, `api/users.js`, `models/AuthorModel.js`. |
| Razorpay automation ideas page | 🟡 | `src/pages/razorpay`, static data in `src/data/razorpayAutomationData.js`. |
| Integrations / plugins / suggestions | 🟡 | `api/integrations.js`, `api/plugins.js`, `api/suggestions.js`. |
| Sign-in (proxy auth token) | 🟡 | `src/pages/auth`, `src/auth.js`, `src/middleware.js`. |
| Batch sync and content-improvement jobs | 🟡 | `api/sync-apps`, `update-blogs`, `update-usecases`, `improve-blogs`, `improve/[id]`, `compare-blogs`, `mongo-to-dbdash`, `udpate-blog-from-db-dash`. See open question 3. |
| Health endpoint | 🟡 | `api/serverhealth.js`. |
| MongoDB connection | 🟡 | `lib/mongoDb.js`. |

## Change log

Newest first: date · who · what · status effect.

- 2026-11-02 · Cursor agent · Created STATUS.md, `npm run status:check`, PR workflow, and the update rule in `AGENTS.md`/`CLAUDE.md` · Inventory added as 🟡; plan scorecard ⛔ (no plan supplied).
