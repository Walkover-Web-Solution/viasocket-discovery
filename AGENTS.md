# AGENTS.md

viaSocket Discovery: a Next.js 14 pages-router app served under `/discovery` on viasocket.com. It has AI-written blogs in MongoDB and file-based compare pages in `content/compare/`. There is no VISION.md or plan yet.

## Progress tracker

Every change to a feature, screen, rule, table or decision updates STATUS.md in the same change (the row, a change-log line, and the "Reviewed up to commit" hash). Update it for teammates who didn't.

`npm run status:check` enforces that for `src/`, `lib/`, `models/`, and `scripts/`. A commit message containing `[no status]` waives the failure for committed changes. The command still lists every commit that touched those directories after the reviewed hash. Pull requests run this check (`.github/workflows/status-check.yml`).

## Critical constraints

- Every URL is under the `/discovery` base path (`next.config.js`). Build absolute URLs with `discoveryUrl()` in `src/lib/site.js`.
- Use the pages router only (`src/pages/`). `src/page.js` and `src/layout.js` are unused app-router leftovers.
- A new compare page is a new `content/compare/<slug>/` folder, with no code change ([README](README.md#compare-pages)).
- Never commit secret values. `.env.local` and `.env.production` are tracked and are bundled into the browser, so only `NEXT_PUBLIC_*` values belong there.
- API routes pick the prod or local database from the request's `env` header. Know which one you are writing to.
- There are no automated tests. Do not claim that a flow needing Mongo, MSG91, or GTWY AI was tested unless you ran it.

## Commands

`npm install` · `npm run dev` (the app is at the `/discovery` path on port 3000) · `npm run build` · `npm run lint` · `npm run status:check`. Details and known gaps are in [docs/development.md](docs/development.md).

## Where to look

| Task | Read |
| --- | --- |
| Add or edit a compare page | [README → Compare pages](README.md#compare-pages) |
| Find a route, service, model, or integration | [docs/architecture.md](docs/architecture.md) |
| Touch auth, API routes, env vars, caching, SEO files, or deploy | [docs/security-and-operations.md](docs/security-and-operations.md) |
| Set up, build, and verify a change | [docs/development.md](docs/development.md) |
| See feature status and open questions | [STATUS.md](STATUS.md) |
| Docs coverage map, reviewed revision, unfinished docs work | [docs/maintenance.md](docs/maintenance.md) |
