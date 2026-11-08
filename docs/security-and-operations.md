# Security and operations

What the code does today, as reviewed at commit `7cab049`. Items marked **finding** are observed risks. None of them is fixed or approved here. Each needs an owner's decision.

## Trust boundaries

- **Login:** the browser holds a MSG91 `proxy_auth_token` (a cookie named after the environment; `localStorage` locally) and sends it as a header (`src/utils/interceptor.js`). On every matched request, `src/middleware.js` exchanges it with MSG91 for a JWT. It decodes the payload **without verifying the signature** (`decodeJwtPayload` in `src/auth.js`), then loads the user from MSG91 by id. The trust comes from the server-to-server call to MSG91, not from the JWT.
- **Admin token:** a request whose token equals `ADMIN_TOKEN` passes the gate, but no `x-profile` is set for it.
- **User identity in routes:** route handlers read the user from the `x-profile` **request** header. The middleware sets `x-profile` on the **response** (`res.headers.set`), not through `NextResponse.next({ request: { headers } })`. Not tested: whether a client-supplied `x-profile` reaches the routes unchanged. If it does, any route that trusts it can be spoofed. Also, the profile (name, email, org) is returned to the browser as a response header.
- **Database choice is client-controlled:** API routes connect to prod or local Mongo based on the request's `env` header.
- **Ungated write routes (finding):** the middleware gate covers only `/api/blog*` (POST, PUT, DELETE), `/api/ask-ai` (POST), and `/api/gethistory` (GET). `PATCH /api/blog/<id>`, `GET /api/blog/<id>/update-blog`, and the batch routes (`improve-blogs`, `improve/[id]`, `update-blogs`, `sync-apps`, `tags`, `mongo-to-dbdash`, `udpate-blog-from-db-dash`) have no gate in this repo. AI-cost routes (`suggestions`, `compare-blogs`, `integrations`) are also ungated. Whether a gateway in front of the app protects them was not confirmed.
- **Token minting (finding):** `POST /api/users` signs a 48h JWT for any posted email and id. Nothing in this repo calls or verifies it.
- **Compare HTML is trusted:** `body.html` is injected with `dangerouslySetInnerHTML` (`src/components/Compare/CompareArticle.js`). Only reviewed commits should change `content/compare/`.

## Secrets and configuration

- **Committed env files (finding):** `.env.local` and `.env.production` are tracked in git. They hold only `NEXT_PUBLIC_*` names, which Next inlines into the browser bundle anyway. Any secret placed in them would be published. `.gitignore` ignores `.env` only.
- Server-only variables read by the code (values are not in the repo): `MONGODB_URI`, `MONGODB_URI_LOCAL`, `PAUTH_KEY`, `PROXY_ADMIN_TOKEN`, `PROXY_USER_REFERENCE_ID`, `ADMIN_TOKEN`, `TOKEN_SECRET_KEY`, `DBDASH_URL`, `DBDASH_VIASOCKET_WEBSITE_KEY`, `PLUGINS_AUTHKEY`, `PLUGINS_DBID`, `PLUGINS_TABLEID`, `RECOMM_AUTHKEY`, `AUTH_KEY_BLOG_DATA`, and the AI bridge ids `BRIDGE_ID`, `BRIDGE_ID_FOR_COMPARE`, `BLUE_PRINT_BRIDGE`, `ROUGH_BLOG_BRIDGE`, `IMPROVE_BRIDGE`, `IMPROVE_UPDATED_CONTENT_BRIDGE`, `DETAILED_REVIEW_IMPROVE`, `DISTINCTIFY_PHRASE_BRIDGE`, `CRUX_GENERATOR`, `UPDATE_OPERATION_GENERATOR`, `IMAGE_GENERATOR_BRIDGE`, `IMAGE_PROMPT_GENERATOR_PROMPT`. To regenerate the list: `rg -o 'process\.env\.[A-Za-z0-9_]+' -N --no-filename src lib models | sort -u`.
- Public variables (`.env.local` and `.env.production`): `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_PROXY_URL`, `NEXT_PUBLIC_NEXT_API_ENVIRONMENT` (`prod` or `local`), the bridge ids `NEXT_PUBLIC_*_BRIDGE` and `NEXT_PUBLIC_BRIDGE_SLUGNAME`, `NEXT_PUBLIC_NEXT_APP_REFERENCE_ID`, `NEXT_PUBLIC_CHAT_BOT_TOKEN`, and `NEXT_PUBLIC_WRITER_GENERATOR_BRIGDE` (sic).
- **Logging:** `askAi()` logs the full prompt payload, including `user_id`, on every call. Errors are posted to viaSocket webhooks (`sendMessageTochannel`).

## Performance and caching

- The middleware matcher is `/:path*`, so it runs on every request, including static assets. With a token present, each request makes two MSG91 calls before it is served. Nothing is cached.
- Blog and user pages use `getServerSideProps` with no `Cache-Control`. Compare pages are static (SSG, `fallback: false`). `llms.txt`, `sitemap.xml`, `robots.txt`, and `compare/<slug>/llm.txt` read the filesystem on each request.
- `askAi()` has a 3-minute timeout. `ask-ai` sets `maxDuration: 30`, which is honored only on platforms that support it. There are no rate limits, retries beyond one AI re-ask, or idempotency keys.
- No performance budget is defined.

## SEO surface

- Only compare pages are in `/discovery/sitemap.xml`. Blogs and user pages are not.
- `/discovery/robots.txt` is served, but crawlers read `https://viasocket.com/robots.txt`. A local server returns 404 for `/robots.txt` because of the base path. Whether the host-level robots file references the Discovery sitemap was not confirmed.
- Compare pages set canonical, OG, and Article + Breadcrumb (+ FAQ) JSON-LD, and link `llm.txt` as an alternate. Blog pages emit their own JSON-LD (`src/pages/blog/[...blogId]/index.js`).

## Deployment and operations

- `Dockerfile`: Node 18.17, `npm install` (there is no lockfile; `package-lock.json` is gitignored), `npm run build:production` (reads `.env.production`), then `npm start` on port 3000. Where it is deployed and how the server-only secrets are injected is not in this repo.
- CI: `.github/workflows/status-check.yml` runs `npm run status:check` on pull requests. There is no CI lint, build, or test.
- Health: `GET /discovery/api/serverhealth` always returns 200. It does not check Mongo, MSG91, or the AI service.
- Rollback, backups, and data recovery: not documented and not tested.
- Batch routes `sync-apps` and `update-blogs` send a 200 first, then fall through to the `405` default after the work (no `break`). `improve/[id]` does the same on error. Expect "headers already sent" errors in logs.
