# Development and verification

## Setup

- Node: the Dockerfile uses **18.17**; CI uses **20** for `status:check`. Local `npm run build` succeeded on the agent VM (2026-11-22).
- `npm install`. There is no lockfile committed; `package-lock.json` is gitignored, so dependency versions can drift.
- Public env comes from committed `.env.local` (dev) and `.env.production` (`build:production`). Server-only secrets must come from your shell or an untracked `.env` — see [security](security-and-operations.md#secrets-and-configuration).
- Dev server: `npm run dev` on port 3000, then browse to the `/automation-ideas` path (not `/` alone).

## Commands

| Command | What it does | Verified 2026-11-22 at `9e85766` |
| --- | --- | --- |
| `npm run dev` | Next dev server | not run |
| `npm run build` | Production build | passes (no server secrets required for compile) |
| `npm start` | Serves build on port 3000 | not run this run |
| `npm run lint` | `next lint` | passes, warnings only |
| `npm run status:check` | `STATUS.md` vs code changes | passes on this branch |
| `npm run build:production` | Build with `.env.production` (Dockerfile) | not run |
| `npm run build:test` | Build with `.env.test` | broken: `.env.test` not in repo |

## Tests

There are no automated tests (no `*.test.*` / `*.spec.*`, no test runner in `package.json`). Verify a change by:

1. `npm run lint` and `npm run build`.
2. `npm start`, then hit affected routes under `/automation-ideas` (e.g. curl the `serverhealth` API with the same host/port as your dev server).
3. Flows that need MongoDB, MSG91 login, GTWY AI, or use-case agents cannot be exercised without secrets — state that in the PR instead of claiming they were tested.

## Conventions observed

- Pages router only. Add routes under `src/pages/`.
- Import with `@/` → `src/`. Import `lib/mongoDb.js` by relative path from services (`../../lib/mongoDb`).
- API handlers `switch` on `req.method`; read `env` and `x-profile` from headers; JSON shape `{ success, data | error }` is common.
- Model factories `createBlogModel(connection)` / `createUsecaseModel(connection)` take the connection from `connectToDatabase(env)`.
- One component per folder with co-located `*.module.scss`.