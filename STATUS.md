**Plan:** Not supplied · **Last updated:** 2026-11-27 · **Reviewed up to commit:** `e956937`

## Legend

✅ works for real people · 🟡 built, not proven · ⛔ blocked · ⬜ not started · 🙈 hidden · ❌ dropped

## At a glance

No plan document was found, so no phase or scope item can be scored. Nothing already in the product is ✅: this pass read the code and did not exercise it with a real session, and the repo has no automated test files.

| | Count |
| --- | --- |
| Plan phases placed | 0 (⛔) |
| Plan scope items placed | 0 (⛔) |
| Must-pass tests from the plan | 0 (⛔) |
| Beyond the plan | 22 rows, all from files in the tree |
| ✅ | 0 |

## Phases

| Phase | Status | Notes |
| --- | --- | --- |
| — | ⛔ | No plan document was found, so no phase could be placed. |

## Scope items

The request named a plan only as the placeholder `<PLAN DOC / LINK>`. Searched and not found: a plan file in the repo or `docs/`, a `VISION.md`, GitHub issues, and a phased plan in `README.md`. There is no plan section, so there is no item table. Every plan item is unplaced because the plan itself was not supplied.

## Must-pass tests

| Test | Status | Notes |
| --- | --- | --- |
| — | ⛔ | The missing plan names no must-pass test. A search found no `*.test.js` or `*.spec.js` files. |

## Open questions

1. Which document should this scorecard track? The request's plan link was not filled in.
2. Should `content/compare/` fail `status:check`? It is a screen, and README says a new page needs no code change. The script watches `src/`, `lib/`, `models/`, and `scripts/` only. There is no `migrations/` directory.
3. ~~README says `content/compare/sample/` is a placeholder.~~ Answered 2026-11-08: commit `5793c48` deleted the folder, and README no longer mentions it.
4. `src/middleware.js` only gates `/api/blog` (POST, PUT, DELETE), `/api/ask-ai` (POST), and `/api/gethistory` (GET). Other write routes are not in that map. Whether something else guards them was not confirmed. The full route-by-gate list is in `docs/architecture.md`.
5. ~~Which Next config file loads?~~ Answered 2026-11-08: `next.config.js`. `npm run build` writes `basePath: /discovery` to `.next/routes-manifest.json`. `next.config.mjs` is unused.
6. `src/page.js`, `src/layout.js`, and `src/page.module.css` sit outside `src/app` (there is no `src/app`). `src/layout.js` imports `./globals.css`, which is not in the tree. They are not wired as routes.

## Beyond the plan

These are in the tree and were not named by a plan. Built code that this pass did not run is 🟡.

| Item | Status | Notes |
| --- | --- | --- |
| Home | 🟡 | `src/pages/index.js` loads blogs, categories, popular users, and three compare summaries. |
| Compare index | 🟡 | `src/pages/compare/index.js` lists `content/compare` via `getCompareSummaries()`. |
| Compare article | 🟡 | `src/pages/compare/[slug]/index.js` builds the page, JSON-LD (`dateModified`, publisher, optional tools ItemList), `llm.txt` and optional `data.json` alternates, and robots meta. HTTP `Link` alternates from `scripts/compare-article-headers.cjs` at build time. |
| Compare plain text | 🟡 | `src/pages/compare/[slug]/llm.txt.js` serves `llm.txt` for a slug. |
| Compare structured data | 🟡 | `src/pages/compare/[slug]/data.json.js` serves optional `data.json` as JSON (404 JSON when missing). |
| Compare JSON catalog | 🟡 | `src/pages/compare/index.json.js` serves `buildCompareIndexJson()`. |
| Comparisons index for agents | 🟡 | `src/pages/llms.txt.js` serves `renderLlmsTxt()` (llms.txt convention). |
| Comparisons full plain text | 🟡 | `src/pages/llms-full.txt.js` serves `renderLlmsFullTxt()`. |
| Sitemap | 🟡 | `src/pages/sitemap.xml.js` lists `/discovery/compare` and each comparison; `lastmod` from `dateModified` or `publishedAt`. |
| Robots | 🟡 | `src/pages/robots.txt.js` allows compare paths, `llms.txt`, and named AI crawlers. |
| Blog page | 🟡 | `src/pages/blog/[...blogId]/index.js`. The In Depth Reviews intro in `src/components/BlogComponents/BlogComponents.js` shows "We independently review every app we recommend" once (it was duplicated). |
| Edit chat | 🟡 | `src/pages/edit/[chatId]/index.js`. |
| User profile | 🟡 | `src/pages/user/[...userId].js` loads the user, their blogs, and compare pages for that author id. |
| Auth return | 🟡 | Prod sign-in starts at `https://viasocket.com/signup?redirect_to=/discovery/auth` when no proxy token is stored; otherwise header and popups show **Go to panel** (`flow.viasocket.com`). Callback reads `proxy_auth` or `proxy_auth_token`, persists before `getCurrentUser`, then redirects to `loginRedirectionPath` or `/discovery`. |
| Blog and comment APIs | 🟡 | `src/pages/api/blog.js`, `blog/[blogId]/*`, `public-blogs.js`, `related-blogs/[blogId].js`. |
| Ask AI, markdown, history | 🟡 | `src/pages/api/ask-ai.js`, `ai.js`, `gethistory.js`. |
| Tags, users, integrations, suggestions | 🟡 | `src/pages/api/tags.js`, `users.js`, `integrations.js`, `suggestions.js`. |
| Improve, sync, and bridge routes | 🟡 | `improve-blogs.js`, `improve/[id].js`, `update-blogs.js`, `udpate-blog-from-db-dash.js`, `sync-apps.js`, `mongo-to-dbdash.js`, `compare-blogs.js`, `serverhealth.js`. |
| Mongo models | 🟡 | `models/BlogModel.js`, `models/AuthorModel.js`, `models/tagsModel.js`, connection helper `lib/mongoDb.js` (prod URI vs local URI). |
| Route gate | 🟡 | `src/middleware.js` and `src/auth.js`. See open question 4. |
| Discovery base path | 🟡 | `next.config.js` sets `basePath` to `/discovery`. `src/lib/site.js` builds `https://viasocket.com/discovery` URLs. |
| Guides | 🟡 | File-based articles at `/discovery/guides/<slug>` from `content/guides/<slug>/` (meta.json, body.html, llm.txt), via `src/lib/guideContent.js` and `src/pages/guides/[slug]/`. Reuses the compare article template. Built and viewed locally with 2 guides; not exercised in prod. Listed in sitemap and `llms.txt`. |
| Compare articles on disk | 🟡 | 29 folders under `content/compare/`, each with `meta.json`. No `data.json` in tree yet. Curl-verified agent routes on built app (not browser). |
| Sample compare page | ❌ | Removed in `5793c48`. README no longer describes it. |
| Leftover app-router files | 🙈 | `src/page.js`, `src/layout.js`, `src/page.module.css`. No `src/app` directory. |
| Embedded chatbot | 🙈 | The chatbot script in `src/pages/_app.js` is commented out. |

## Change log

- 2026-11-27 · cursor agent · Merged PR #175: Guides content type (`/discovery/guides/<slug>`) with two guides; guides in sitemap and `llms.txt`. Resolved `STATUS.md` conflict with `main`. · Guides row; compare on disk count
- 2026-11-27 · cursor agent · When a proxy auth token is already in cookies/storage, Login entry points show **Go to panel** instead of viasocket signup (INT-K7M2P4). · Auth return row
- 2026-11-26 · cursor agent · Agent-first compare: optional `data.json`, `compare/index.json`, improved `llms.txt`, `llms-full.txt`, robots crawler allows, JSON-LD and sitemap `dateModified`, README and docs. Added `docs/INTENTS.md` INT-A1G3NT0. Reviewed up to `bc92dc3`. · Compare article, plain text, sitemap, robots, and new agent routes; compare on disk note.
- 2026-11-26 · cursor agent · Reverted PR #172 merge, then accept `proxy_auth` on `/discovery/auth` so callback tokens persist and users return to Discovery (INT-P4R7Q2). · Auth return row
- 2026-11-26 · cursor agent · Discovery sign-in uses viasocket.com `/signup` with `redirect_to=/discovery/auth` instead of `/login` (307 to flow). Added `authRedirect.js` and `docs/INTENTS.md` INT-A8K2M9. Reviewed up to `829a531`. · Auth return row
- 2026-11-19 · cursor agent · Fixed Discovery login callback: persist token from URL before redirect (race with `WithAuth`), gate auth effects on `router.isReady`, unify token reads via `getProxyAuthToken()`, fix cookie `expires`, and restore local header Login/Signup links. Reviewed up to `f5583f1`. · Auth return notes; no status emoji change (not exercised end-to-end with MSG91).
- 2026-11-08 · cursor agent (docs refresh) · Added `docs/` (architecture, development, security and operations, maintenance) and an AGENTS.md task map. Answered open questions 3 and 5. Reviewed up to `7cab049`. · Sample compare page ⬜ → ❌
- 2026-11-04 · Ragini Mahobiya (Claude) · Removed the duplicated "We independently review every app we recommend" sentence from the In Depth Reviews section of the blog page. Reviewed up to `957486b`. · Blog page notes updated; status unchanged 🟡
- 2026-11-03 · cursor agent · Set "Reviewed up to commit" to `8cb3934`, the commit that added the tracker. This line cannot name its own commit: writing the hash would change it. · no row changes
- 2026-11-03 · cursor agent · Added this scorecard, `npm run status:check`, and the PR workflow. No plan was found, so phases, scope items, and plan tests are ⛔. Code that exists is 🟡 or 🙈. The sample compare folder is ⬜. · ⛔ plan sections; no ✅
