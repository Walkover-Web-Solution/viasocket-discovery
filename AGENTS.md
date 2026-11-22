# AGENTS.md

viaSocket Automation Ideas: a Next.js 14 **pages-router** app served under `/automation-ideas` on viasocket.com. It surfaces AI-generated **automation use cases** and **blogs** in MongoDB. There is no VISION.md or product plan in this branch.

## Progress tracker

Every change to a feature, screen, rule, table or decision updates `STATUS.md` in the same change (the row, a change-log line, and the **Reviewed up to commit** hash). Update it for teammates who didn't.

`npm run status:check` enforces that for `src/`, `lib/`, `models/`, and `scripts/`. A commit message containing `[no status]` waives the failure for committed changes. Pull requests run this check (`.github/workflows/status-check.yml`).

## Critical constraints

- Every URL is under the `/automation-ideas` base path (`next.config.mjs`). Absolute links in pages use `https://viasocket.com/automation-ideas/...` inline; there is no shared `site.js` helper on this branch.
- Use the pages router only (`src/pages/`). `src/page.js`, `src/layout.js`, and `src/page.module.css` are unused app-router leftovers.
- Never commit secret values. `.env.local` and `.env.production` are tracked and are bundled into the browser, so only `NEXT_PUBLIC_*` values belong there.
- API routes pick the prod or local database from the request's `env` header (`NEXT_PUBLIC_NEXT_API_ENVIRONMENT` on the client). Know which one you are writing to.
- There are no automated tests. Do not claim that a flow needing Mongo, MSG91, or GTWY AI was tested unless you ran it.
- A/B helpers live in `src/utils/experiments.js`. No page uses them yet; the middleware owns variant assignment. See [README → Experiments](README.md#experiments).

## Commands

`npm install` · `npm run dev` (port 3000; use the `/automation-ideas` path) · `npm run build` · `npm run lint` · `npm run status:check`. Details and verification limits are in [docs/development.md](docs/development.md).

## Where to look

| Task | Read |
| --- | --- |
| Feature inventory and open questions | [STATUS.md](STATUS.md) |
| Routes, models, API map, integrations | [docs/architecture.md](docs/architecture.md) |
| Setup, build, lint, manual verification | [docs/development.md](docs/development.md) |
| Auth, secrets, SEO, deploy, experiments | [docs/security-and-operations.md](docs/security-and-operations.md) |
| A/B recording helpers (no active experiment) | [README → Experiments](README.md#experiments) |
| Razorpay static showcase page | `src/pages/razorpay/`, `src/data/razorpayAutomationData.js` |
| Docs coverage map, reviewed revision, unfinished work | [docs/maintenance.md](docs/maintenance.md) |