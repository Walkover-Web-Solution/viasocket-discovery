**Plan:** none found · **Last updated:** 2026-11-04 · **Reviewed up to commit:** `5fb229cb6da1ecaed9666398a9448e455cb7073b`

## Legend

✅ works for real people · 🟡 built, not proven · ⛔ blocked · ⬜ not started · 🙈 hidden · ❌ dropped

## At a glance

No plan document was found. The request named the plan as `<PLAN DOC / LINK>`. That placeholder was not a file or a link. `origin/main` has no plan file, the README does not name phases, and the GitHub repo has no issues. Phases, scope items, and plan must-pass tests are ⛔. Nothing is ✅: this pass read the code and did not run the app, and the repo has no test suite.

| | Count |
| --- | --- |
| ✅ works for real people | 0 |
| 🟡 built, not proven | 34 |
| 🙈 hidden | 2 |
| ⬜ not started | 1 (automated tests) |
| ⛔ blocked | plan phases, plan scope, plan must-pass tests |
| ❌ dropped | 0 |

## Phases

| Phase | Status | Notes |
| --- | --- | --- |
| (none named) | ⛔ | No plan document. Nothing to score. |

## Scope items

No plan sections were found, so there is no scope table.

Plan items that could not be placed: all of them. No plan item was named in the repo, in `README.md`, on `origin/main`, or in GitHub issues.

## Must-pass tests

| Test | Status | Notes |
| --- | --- | --- |
| (none named by a plan) | ⛔ | No plan document. |
| Automated test suite | ⬜ | No `*.test.js` or `*.spec.js` files. `package.json` has no `test` script. |

## Open questions

1. Which document is the plan? Until one exists, new work stays under Beyond the plan.
2. Should `content/compare/` be watched by `scripts/status-check.mjs`? A new article is a new screen. The README says a new compare page does not need a code change. The check does not watch `content/`.
3. There is no `migrations/` directory. The check watches `src/`, `lib/`, `models/`, and `scripts/`.
4. `next.config.js` sets `basePath` to `/discovery`. `next.config.mjs` exports an empty config. This pass did not confirm which file Next loads.
5. `src/middleware.js` requires `proxy_auth_token` only for `/api/blog` (POST, PUT, DELETE), `/api/ask-ai` (POST), and `/api/gethistory` (GET). Other routes that write or bulk-update are outside that list. Whether that is intentional is not written down.
6. README says `content/compare/sample/` is a placeholder so the routes can be reviewed. That folder is not in the tree. Thirteen real compare folders are.

## Beyond the plan

Statuses below come from files in this repo at the reviewed commit. Built and not run for a real person is 🟡.

### Screens

| Item | Status | Notes |
| --- | --- | --- |
| Discovery home | 🟡 | `src/pages/index.js` loads popular users, categories, and three compare summaries. Not run in this pass. |
| Blog page | 🟡 | `src/pages/blog/[...blogId]/index.js`. |
| User page | 🟡 | `src/pages/user/[...userId].js` also loads that author's compare pages. |
| Sign-in return | 🟡 | `src/pages/auth/index.js` reads `proxy_auth_token` and sends the browser back to Discovery. |
| Edit chat | 🟡 | `src/pages/edit/[chatId]/index.js` mounts the middleware chat component. |
| Header | 🟡 | `src/components/Header/Header.js` links Discovery, Explore more, Support, Pricing, and login. |
| Ask AI on home and blog | 🟡 | Home and blog dispatch an ask-ai event into `src/components/ChatBot/ChatBot.js`. |
| Compare index | 🟡 | `src/pages/compare/index.js` lists folders under `content/compare/`. |
| Compare article | 🟡 | `src/pages/compare/[slug]/index.js`. |
| Compare article plain text | 🟡 | `src/pages/compare/[slug]/llm.txt.js` serves `llm.txt`. |
| Plain-text index | 🟡 | `src/pages/llms.txt.js`. |
| Sitemap | 🟡 | `src/pages/sitemap.xml.js` writes compare URLs. |
| Robots | 🟡 | `src/pages/robots.txt.js` allows `/discovery/compare`. |

### APIs and jobs

| Item | Status | Notes |
| --- | --- | --- |
| Blog API | 🟡 | `src/pages/api/blog.js` and `src/pages/api/blog/[blogId]/`. Middleware requires a token for POST, PUT, and DELETE. |
| Comments | 🟡 | `src/pages/api/blog/[blogId]/comments/`. Same `/api/blog` middleware prefix. |
| Ask AI API | 🟡 | `src/pages/api/ask-ai.js`. Middleware protects POST. |
| Chat history | 🟡 | `src/pages/api/gethistory.js`. Middleware protects GET. |
| AI markdown | 🟡 | `src/pages/api/ai.js`. Not in the middleware protected list. |
| Suggestions | 🟡 | `src/pages/api/suggestions.js`. Not in the middleware protected list. |
| Tags | 🟡 | `src/pages/api/tags.js`. The home page imports `getCategoriesFromDbDash` from this file. |
| Integrations | 🟡 | `src/pages/api/integrations.js`. Not in the middleware protected list. |
| Public blogs | 🟡 | `src/pages/api/public-blogs.js` returns improved blogs. Not in the middleware protected list. |
| Related blogs | 🟡 | `src/pages/api/related-blogs/[blogId].js`. |
| Users | 🟡 | `src/pages/api/users.js` reads the `x-profile` header. |
| Health | 🟡 | `src/pages/api/serverhealth.js` returns `{ status: 'ok' }` and does not check a dependency. |
| Chat compare proxy | 🟡 | `src/pages/api/compare-blogs.js` posts to `routes.msg91.com`. `src/utils/apis/chatbotapis.js` calls it. Separate from the file-based compare pages. Not in the middleware protected list. |
| Improve blogs | 🟡 | `src/pages/api/improve-blogs.js` and `src/pages/api/improve/[id].js`. POST answers 200 before the work finishes. Not in the middleware protected list. |
| Sync apps | 🟡 | `src/pages/api/sync-apps.js`. GET answers 200 before the work finishes. Not in the middleware protected list. |
| Bulk comment merge | 🟡 | `src/pages/api/update-blogs.js`. POST answers 200 before the work finishes. Not in the middleware protected list. |
| DB Dash blog patch | 🟡 | `src/pages/api/udpate-blog-from-db-dash.js` (the filename spells `udpate`). PATCH. Not in the middleware protected list. |
| Mongo to DB Dash | 🟡 | `src/pages/api/mongo-to-dbdash.js` copies blogs on POST. Not in the middleware protected list. |

### Data

| Item | Status | Notes |
| --- | --- | --- |
| Mongo models | 🟡 | `lib/mongoDb.js` uses `MONGODB_URI` or `MONGODB_URI_LOCAL`. Models: `models/BlogModel.js`, `models/AuthorModel.js`, `models/tagsModel.js`. |
| Compare articles on disk | 🟡 | `src/lib/compareContent.js` reads `content/compare/<slug>/` (`meta.json`, `body.html`, `llm.txt`). Thirteen folders are present. `content/compare/sample/` is documented and absent. |

### Not on a route

| Item | Status | Notes |
| --- | --- | --- |
| Old navbar | 🙈 | `src/components/Navbar/Navbar.js` is marked depreciated. No other file imports it. |
| Unused root page and layout | 🙈 | `src/page.js` and `src/layout.js` sit outside `src/pages` and there is no `src/app`. `src/layout.js` imports `./globals.css`, which is not in the tree. |

### This change

| Item | Status | Notes |
| --- | --- | --- |
| Progress scorecard | 🟡 | `STATUS.md`, `npm run status:check`, and `.github/workflows/status-check.yml`. Each code commit must update this file, or say `[no status]`. Local pass/fail is in the change log. Not used by people yet. |

## Change log

- 2026-11-04 · Cursor Agent · The status check fails a commit that touches `src/`, `lib/`, `models/`, or `scripts/` and does not update this file, unless that commit says `[no status]`. Reviewed hash moved to the scorecard commit. · 🟡 progress scorecard note
- 2026-11-04 · Cursor Agent · Added the scorecard, the status check, and the pull-request workflow. No plan document was found, so phases and scope stay blocked. Code that exists is listed above as built, not proven. · ⛔ plan sections; 🟡 34; 🙈 2; ⬜ test suite; nothing ✅
