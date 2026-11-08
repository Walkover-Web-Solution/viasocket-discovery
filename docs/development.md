# Development and verification

## Setup

- Node: the Dockerfile uses 18.17, and CI uses 20 for the status check. A build on Node 22 also passed on 2026-11-08.
- `npm install`. There is no lockfile in git, so dependency versions can drift between installs.
- Public env comes from the committed `.env.local` (dev) and `.env.production` (`build:production`). Server-only secrets (Mongo, MSG91, GTWY, DbDash: see [security](security-and-operations.md#secrets-and-configuration)) must come from your shell or an untracked `.env`. Never commit their values.
- The app runs under the base path: on the dev server (port 3000) open the `/discovery` path, not `/`.

## Commands

| Command | What it does | Verified 2026-11-08 at `7cab049` |
| --- | --- | --- |
| `npm run dev` | Next dev server | not run |
| `npm run build` | Production build. Compare pages are prerendered from `content/compare/`. | passes with no secrets set |
| `npm start` | Serves the build on port 3000 | ran with `-p 3123`. Compare, `llms.txt`, `sitemap.xml`, and `robots.txt` returned 200. An unknown slug returned 404. `POST /discovery/api/blog` without a token returned 401. |
| `npm run lint` | `next lint` (`next/core-web-vitals`) | passes, warnings only |
| `npm run status:check` | Fails when `src/`, `lib/`, `models/`, or `scripts/` changed without `STATUS.md` ([AGENTS.md](../AGENTS.md)) | passes |
| `npm run build:production` | Build with `.env.production` (used by the Dockerfile) | not run |
| `npm run build:test` | Build with `.env.test` | broken: `.env.test` is not in the repo |

## Tests

There are no automated tests (no `*.test.*` or `*.spec.*` files, and no test runner in `package.json`). Until one exists, verify a change by:

1. `npm run lint` and `npm run build`.
2. `npm start`, then request the affected routes under `/discovery` (for example with `curl -s -o /dev/null -w '%{http_code}'`).
3. Flows that need MongoDB, MSG91 login, or GTWY AI (blogs, chat, comments, profiles) cannot be exercised without those secrets. Say so in the pull request instead of claiming they were tested.

When a test runner is added, write the failing test first, then implement until it passes. Pure modules such as `src/lib/compareContent.js` are the easiest place to start.

## Conventions observed

- Pages router only. Add routes under `src/pages/`, not `src/app/`.
- Import with `@/` (maps to `src/`). The Mongo helper is the root `lib/mongoDb.js`, imported by relative path.
- API handlers `switch` on `req.method`. They read `env` and `x-profile` from headers and return `{ success, data | error }`.
- Model factories (`createBlogModel(connection)`) take the connection from `connectToDatabase(env)`.
- One component per folder with a co-located `*.module.scss`.
- Compare pages are content, not code: add a folder and do not touch `src/`. See [README](../README.md#compare-pages).
