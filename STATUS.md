**Plan:** Not supplied · **Last updated:** 2026-11-04 · **Reviewed up to commit:** `957486b8aa8570b407d28081dfbde05a7189c90d`

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
3. README says `content/compare/sample/` is a placeholder so the routes can be reviewed. That folder is not in the tree. Thirteen other compare slugs are.
4. `src/middleware.js` only gates `/api/blog` (POST, PUT, DELETE), `/api/ask-ai` (POST), and `/api/gethistory` (GET). Other write routes are not in that map. Whether something else guards them was not confirmed.
5. `next.config.js` sets `basePath: '/discovery'`. `next.config.mjs` is an empty config. Which file Next loads was not confirmed.
6. `src/page.js`, `src/layout.js`, and `src/page.module.css` sit outside `src/app` (there is no `src/app`). `src/layout.js` imports `./globals.css`, which is not in the tree. They are not wired as routes.

## Beyond the plan

These are in the tree and were not named by a plan. Built code that this pass did not run is 🟡.

| Item | Status | Notes |
| --- | --- | --- |
| Home | 🟡 | `src/pages/index.js` loads blogs, categories, popular users, and three compare summaries. |
| Compare index | 🟡 | `src/pages/compare/index.js` lists `content/compare` via `getCompareSummaries()`. |
| Compare article | 🟡 | `src/pages/compare/[slug]/index.js` builds the page, JSON-LD, and an `llm.txt` alternate from `src/lib/compareContent.js`. |
| Compare plain text | 🟡 | `src/pages/compare/[slug]/llm.txt.js` serves `llm.txt` for a slug. |
| Comparisons index for agents | 🟡 | `src/pages/llms.txt.js` serves `renderLlmsTxt()`. |
| Sitemap | 🟡 | `src/pages/sitemap.xml.js` lists `/discovery/compare` and each comparison only. |
| Robots | 🟡 | `src/pages/robots.txt.js` allows `/`, the compare paths, and `/discovery/llms.txt`. |
| Blog page | 🟡 | `src/pages/blog/[...blogId]/index.js`. The In Depth Reviews intro in `src/components/BlogComponents/BlogComponents.js` shows "We independently review every app we recommend" once (it was duplicated). |
| Edit chat | 🟡 | `src/pages/edit/[chatId]/index.js`. |
| User profile | 🟡 | `src/pages/user/[...userId].js` loads the user, their blogs, and compare pages for that author id. |
| Auth return | 🟡 | `src/pages/auth/index.js` reads `proxy_auth_token` and sends the browser on. |
| Blog and comment APIs | 🟡 | `src/pages/api/blog.js`, `blog/[blogId]/*`, `public-blogs.js`, `related-blogs/[blogId].js`. |
| Ask AI, markdown, history | 🟡 | `src/pages/api/ask-ai.js`, `ai.js`, `gethistory.js`. |
| Tags, users, integrations, suggestions | 🟡 | `src/pages/api/tags.js`, `users.js`, `integrations.js`, `suggestions.js`. |
| Improve, sync, and bridge routes | 🟡 | `improve-blogs.js`, `improve/[id].js`, `update-blogs.js`, `udpate-blog-from-db-dash.js`, `sync-apps.js`, `mongo-to-dbdash.js`, `compare-blogs.js`, `serverhealth.js`. |
| Mongo models | 🟡 | `models/BlogModel.js`, `models/AuthorModel.js`, `models/tagsModel.js`, connection helper `lib/mongoDb.js` (prod URI vs local URI). |
| Route gate | 🟡 | `src/middleware.js` and `src/auth.js`. See open question 4. |
| Discovery base path | 🟡 | `next.config.js` sets `basePath` to `/discovery`. `src/lib/site.js` builds `https://viasocket.com/discovery` URLs. |
| Compare articles on disk | 🟡 | 13 folders under `content/compare/`, each with `meta.json`. Not opened in a browser this pass. |
| Sample compare page | ⬜ | README describes `content/compare/sample/`. The folder is not in the tree. |
| Leftover app-router files | 🙈 | `src/page.js`, `src/layout.js`, `src/page.module.css`. No `src/app` directory. |
| Embedded chatbot | 🙈 | The chatbot script in `src/pages/_app.js` is commented out. |

## Change log

- 2026-11-04 · Ragini Mahobiya (Claude) · Removed the duplicated "We independently review every app we recommend" sentence from the In Depth Reviews section of the blog page. Reviewed up to `957486b`. · Blog page notes updated; status unchanged 🟡
- 2026-11-03 · cursor agent · Set "Reviewed up to commit" to `8cb3934`, the commit that added the tracker. This line cannot name its own commit: writing the hash would change it. · no row changes
- 2026-11-03 · cursor agent · Added this scorecard, `npm run status:check`, and the PR workflow. No plan was found, so phases, scope items, and plan tests are ⛔. Code that exists is 🟡 or 🙈. The sample compare folder is ⬜. · ⛔ plan sections; no ✅
