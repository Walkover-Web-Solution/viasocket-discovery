# STATUS

**Plan:** none provided (no plan document in this repo; see Open questions) · **Last updated:** 2026-11-02 · **Reviewed up to commit:** `ddba9f46f30e`

Legend: ✅ works for real people · 🟡 built, not proven · ⛔ blocked · ⬜ not started · 🙈 hidden · ❌ dropped

Every status rests on code read at the reviewed commit. Nothing here has been checked with real users or against production, so nothing is ✅ yet. `npm run status:check` keeps this file in step with the code (see `AGENTS.md`).

## At a glance

| | Count |
|---|---|
| Plan items placed | 0: no plan to place them against |
| Items found in code (Beyond the plan) | 28 |
| ✅ / 🟡 / ⛔ / ⬜ / 🙈 / ❌ | 0 / 24 / 0 / 1 / 3 / 0 |
| Automated tests | none in the repo |
| Open questions | 7 |

## Phases

No plan, so no phases. When a plan is linked, list its phases here: Phase | Goal | Status | Notes.

## Scope items

No plan sections to score. Each plan section gets its own table here (Item | Status | Notes). Rows under "Beyond the plan" move here once a plan claims them.

## Must-pass tests

| Test | Status | Notes |
|---|---|---|
| `npm run lint` | 🟡 | Passes with warnings only (react-hooks/exhaustive-deps, one import/no-anonymous-default-export). Not run in CI. |
| `npm run status:check` | 🟡 | Runs on every PR (`.github/workflows/status-check.yml`). |
| `npm run build` | ⬜ | Not run here: needs the env vars listed in `src/` (Mongo, MSG91 proxy, AI bridge ids). |
| Unit / end-to-end tests | ⬜ | None exist. |

## Open questions

1. **Which plan does this track?** No plan, roadmap or spec exists in the repo or its history. Link it in the header, then move rows from "Beyond the plan" into "Scope items".
2. **Which paths count as code?** `status:check` watches `src/`, `lib/`, `models/` and `next.config.*`. It does not watch `content/compare/`: per `README.md` a compare page "does not need a code change". Should new compare pages update this file too?
3. **Are the batch/admin API routes protected outside this app?** `src/middleware.js` guards only `/api/blog` (POST/PUT/DELETE), `/api/ask-ai` (POST) and `/api/gethistory` (GET). `/api/improve-blogs`, `/api/improve/[id]`, `/api/update-blogs`, `/api/sync-apps`, `/api/tags`, `/api/mongo-to-dbdash`, `/api/udpate-blog-from-db-dash` and `/api/blog/[blogId]/update-blog` have no check in this repo.
4. **How does `x-profile` reach API handlers?** The middleware sets it on the response (`res.headers.set`), but handlers read it from the request. Unconfirmed whether Next forwards it. If not, handlers read whatever header the client sends.
5. **`PATCH /api/blog/[blogId]` is not in the middleware's method list.** Without a profile it fails with a 400 on `user.id`, not a 401.
6. **`content/compare/sample/` is described in `README.md` but does not exist.** Remove the README line or add the folder?
7. **Two Next configs:** `next.config.js` sets `basePath: '/discovery'`; `next.config.mjs` is empty. Next loads the `.js` one; delete the `.mjs` one?

## Beyond the plan

Everything the code does today, by area. With no plan, it all lands here.

### Discovery home and search

| Item | Status | Notes |
|---|---|---|
| Home page with blog list and categories | 🟡 | `src/pages/index.js` (server-side props, `HomePageContent`). |
| Search blogs by text or `#tag` | 🟡 | `GET /api/blog?search=`; text search also returns matching tags. |
| Title suggestions when search has no results | 🟡 | `POST /api/suggestions`, `NoResultsSuggestions`. |
| Ask AI to create a blog from a search | 🟡 | `handleAskAi` on the home page posts to `/api/blog`, then opens `/blog/<id>`. Needs sign-in. |
| Compare block on home | 🟡 | `CompareHomeBlock` in `HomePageContent`. |

### Blog pages

| Item | Status | Notes |
|---|---|---|
| Blog page with integrations, FAQ and related blogs | 🟡 | `src/pages/blog/[...blogId]/index.js`, `/api/related-blogs/[blogId]`, `/api/integrations`. |
| Ask AI follow-ups on a blog | 🟡 | `ChatBot` → `POST /api/ask-ai` (signed in), history via `/api/gethistory`. |
| Comments / suggestions: add and delete | 🟡 | `AddCommentPopup`, `/api/blog/[blogId]/comments`. New comments are `pending`. |
| "Publish Changes" button on the blog page | 🙈 | Commented out in `src/pages/blog/[...blogId]/index.js`. |
| Chat edit page `/edit/[chatId]` | 🙈 | Page exists; nothing in `src/` links to it. |

### Compare pages (file-based)

| Item | Status | Notes |
|---|---|---|
| Compare index `/compare` and article `/compare/<slug>` | 🟡 | `src/lib/compareContent.js` reads `content/compare/<slug>/`; 6 pages committed. |
| `llm.txt` per article and `/llms.txt` index | 🟡 | `src/pages/compare/[slug]/llm.txt.js`, `src/pages/llms.txt.js`. |
| Author byline and author's comparisons on the user page | 🟡 | `AuthorComparisons` in `src/pages/user/[...userId].js`. |
| AI blog comparison API `/api/compare-blogs` | 🙈 | Route and `compareBlogs()` client exist; no UI calls it. |

### Users and auth

| Item | Status | Notes |
|---|---|---|
| Sign-in via MSG91 proxy token | 🟡 | `src/auth.js` exchanges `proxy_auth_token` for a JWT and loads the user. `ADMIN_TOKEN` bypass. |
| Auth redirect page `/auth` | 🟡 | `src/pages/auth/index.js`. |
| User profile page with their blogs | 🟡 | `src/pages/user/[...userId].js`. |
| Top contributors | 🟡 | `TopContributors` component. |
| `POST /api/users` issues a 48h JWT | 🟡 | `src/pages/api/users.js`; no caller found in `src/`. |

### Content pipeline (batch jobs)

| Item | Status | Notes |
|---|---|---|
| AI improve all blogs / one blog | 🟡 | `/api/improve-blogs`, `/api/improve/[id]`. Unprotected here (Open question 3). |
| Merge pending comments into blogs | 🟡 | `/api/update-blogs`, `/api/blog/[blogId]/update-blog`. |
| Sync apps across blogs | 🟡 | `GET /api/sync-apps`. |
| Merge tags, parameters and categories | 🟡 | `POST /api/tags`. |
| DB Dash sync both ways | 🟡 | `/api/mongo-to-dbdash`, `/api/udpate-blog-from-db-dash`. |
| `/api/ai` | ⬜ | Stub: the default handler never sends a response. |

### SEO and ops

| Item | Status | Notes |
|---|---|---|
| `sitemap.xml` and `robots.txt` | 🟡 | Include the compare pages. |
| Health check `/api/serverhealth` | 🟡 | Static OK response. |
| Status tracker (`STATUS.md`, `npm run status:check`, PR workflow) | 🟡 | Added 2026-11-02; first PR run pending. |

## Change log

Newest first: date · who · what · status effect.

- 2026-11-02 · Cursor agent · Created `STATUS.md`, `scripts/status-check.mjs`, the PR workflow, and the status rule in `AGENTS.md` / `CLAUDE.md`. Reviewed code at `ddba9f46f30e`. · 28 items found; none placed against a plan (no plan provided).
