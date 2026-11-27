# Product intents (rules earlier changes established)

## INT-A8K2M9 — Discovery auth entry via viasocket.com signup

| Field | Value |
| --- | --- |
| Kind | constraint |
| Module | auth |
| Title | Use `/signup`, not `/login`, for Discovery handoff |
| What | Production sign-in links from Discovery must target `https://viasocket.com/signup` with `redirect_to=/discovery/auth` (and optional `utm_source`). They must not use `https://viasocket.com/login`. |
| Why | viasocket.com `/login` 307-redirects to flow.viasocket.com and does not complete the MSG91 callback to `/discovery/auth`. |
| Paths | `src/utils/authRedirect.js`, `src/components/Header/Header.js`, `src/utils/utils.js` |
| Tests | none automated |

## INT-P4R7Q2 — Persist proxy token from callback query aliases

| Field | Value |
| --- | --- |
| Kind | constraint |
| Module | auth |
| Title | Accept `proxy_auth` and `proxy_auth_token` on auth callback |
| What | When viasocket redirects to `/discovery/auth`, `persistProxyAuthTokenFromSearch` must read either `proxy_auth` or `proxy_auth_token` from the query string, store under `proxy_auth_token`, and send that value as the `proxy_auth_token` request header on client API calls. The auth callback must not re-launch MSG91 when either param is present. |
| Why | viasocket sign-in callbacks use `proxy_auth`; treating only `proxy_auth_token` leaves the callback without a session and can send users back through central login (viasocket homepage). |
| Paths | `src/utils/storageHelper.js`, `src/pages/auth/index.js`, `src/context/UserContext.js`, `src/components/auth/WithAuth.js` |
| Tests | none automated |

## INT-K7M2P4 — Panel link when proxy token already stored

| Field | Value |
| --- | --- |
| Kind | constraint |
| Module | auth |
| Title | Skip signup when `proxy_auth_token` is already stored |
| What | When `getProxyAuthToken()` returns a value (cookie or `localStorage`), Discovery sign-in entry points must not send the user to `viasocket.com/signup` again. They must offer **Go to panel** linking to `https://flow.viasocket.com` (or `/discovery` in local env). `handleSignIn` and the header follow `getDiscoveryAuthEntry()` in `authRedirect.js`. |
| Why | A user who just signed in already holds the proxy token; sending them through signup again is confusing and does not complete in Discovery. |
| Paths | `src/utils/authRedirect.js`, `src/components/Header/Header.js`, `src/utils/utils.js`, `src/components/UnauthorisedPopup/UnauthorisedPopup.js`, `src/pages/auth/index.js` |
| Tests | none automated |

## INT-A1G3NT0 — Agent-first compare twins

| Field | Value |
| --- | --- |
| Kind | constraint |
| Module | compare |
| Title | Agent-first compare twins |
| What | Compare pages keep human HTML unchanged. Agents get optional per-slug `data.json`, catalog `compare/index.json`, `llms.txt`, and `llms-full.txt`. Routes use `discoveryUrl()`, safe slugs, and skip folders without `meta.json`. |
| Why | Let crawlers and agents fetch structured compare content without scraping HTML. |
| Constraints | No new npm dependencies; pages router only; no edits under `content/compare/` except optional `data.json` in a `sample` folder when present. |
| Acceptance | Existing compare folders without `data.json` still build; missing `data.json` returns 404 JSON; `npm run status:check` passes when STATUS.md is updated. |
| Paths | `src/lib/compareContent.js`, `src/pages/compare/`, `src/pages/llms*.js`, `scripts/compare-article-headers.cjs` |
| Tests | Manual curl of agent routes after `npm run build` (see PR description). |
| Risk | low |