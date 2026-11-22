# Security and operations

Observed behavior as reviewed at commit `9e85766`. Items marked **finding** are risks or gaps; this doc does not fix them.

## Trust boundaries

- **Login:** browser stores MSG91 `proxy_auth_token` (cookie / localStorage) and sends it on axios calls (`src/utils/interceptor.js`). Middleware exchanges it with MSG91; JWT payload is decoded **without signature verification** (`decodeJwtPayload` in `src/auth.js`), then user is loaded from MSG91 by id.
- **Admin token:** `ADMIN_TOKEN` bypasses user profile but passes the gate.
- **User identity in routes:** handlers read `x-profile` from the **request**. Middleware sets `x-profile` on the **response** (`res.headers.set`). Whether client-supplied `x-profile` reaches handlers was **not tested** on this branch.
- **Database target:** API routes use the client `env` header to choose prod vs local Mongo.
- **Gated routes:** middleware protects `POST/PUT/DELETE` on `/api/blog`, `POST` on `/api/ask-ai` and `/api/usecases`, `GET` on `/api/gethistory`. `PATCH` is listed for `/api/usecases` but no handler exists.
- **Ungated write routes (finding):** batch routes (`update-usecases`, `update-blogs`, `improve-blogs`, `improve/[id]`, `sync-apps`, `tags`, `mongo-to-dbdash`, `udpate-blog-from-db-dash`), `PATCH` blog updates, `POST /api/users`, and AI-cost routes (`suggestions`, `compare-blogs`, `integrations`) have no middleware gate. External gateway protection was **not confirmed**.
- **Early response then more work (finding):** `update-usecases.js` (and similar on main) responds 200 then continues; may hit default 405 if execution falls through.

## Secrets and configuration

- **Committed env files (finding):** `.env.local` and `.env.production` are tracked. They should contain only `NEXT_PUBLIC_*` (inlined into the browser bundle). `.gitignore` ignores `.env` only.
- **Server-only names** (values not documented here): `MONGODB_URI`, `MONGODB_URI_LOCAL`, `PAUTH_KEY`, `PROXY_*`, `ADMIN_TOKEN`, `TOKEN_SECRET_KEY`, DbDash/plug keys, AI bridge ids (`BLUE_PRINT_BRIDGE`, `ROUGH_BLOG_BRIDGE`, `IMPROVE_*`, …), **`USECASE_CREATE`**, **`USECASE_UPDATE`**, etc. Regenerate list: `rg -o 'process\.env\.[A-Za-z0-9_]+' -N --no-filename src lib models | sort -u`.
- **Public names** in committed env files: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_PROXY_URL`, `NEXT_PUBLIC_NEXT_API_ENVIRONMENT`, bridge ids (`NEXT_PUBLIC_*_BRIDGE`), `NEXT_PUBLIC_NEXT_APP_REFERENCE_ID`, `NEXT_PUBLIC_CHAT_BOT_TOKEN`, `NEXT_PUBLIC_PLUG_SERVICE_URL`, optional **`NEXT_PUBLIC_MW_EVENTS_URL`** and **`NEXT_PUBLIC_MW_KEY`** for experiments helpers.

## Performance and caching

- Middleware matcher `/:path*`: runs on all requests; with a token, MSG91 calls per request. No caching layer documented.
- Blog, use case, and user pages use SSR (`getServerSideProps`) without documented `Cache-Control`.
- `askAi()` uses a long timeout in utils; platform `maxDuration` on routes may cap serverless runs. No in-repo rate limits or idempotency.

## SEO surface

- No `sitemap.xml`, `robots.txt`, or `llms.txt` routes found on this branch (unlike Discovery `main` compare surface).
- Blog and use case pages set JSON-LD / meta in their page files (hard-coded `https://viasocket.com/automation-ideas/...` URLs). Host-level SEO policy was **not confirmed**.

## Experiments

- `src/utils/experiments.js` posts to `NEXT_PUBLIC_MW_EVENTS_URL` with bearer `NEXT_PUBLIC_MW_KEY`. Assignment is server-side; helpers no-op when unset. **No page imports them yet** — no UI experiment is running.

## Deployment and operations

- **Dockerfile:** Node 18.17, `npm install`, `npm run build:production`, `npm start` on port 3000. Deploy target and secret injection are **not in this repo**.
- **CI:** `.github/workflows/status-check.yml` runs `npm run status:check` on pull requests only (no lint/build in CI).
- **Health:** `GET .../api/serverhealth` always returns 200; does not check dependencies.
- Rollback, backups, batch job scheduling: **not documented**.