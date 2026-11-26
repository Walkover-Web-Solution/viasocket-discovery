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
| What | When MSG91 or viasocket redirect to Discovery, `persistProxyAuthTokenFromSearch` must read either `proxy_auth` or `proxy_auth_token` from the query string, store under `proxy_auth_token`, and send that value as the `proxy_auth_token` request header on client API calls. |
| Why | Callback URLs vary by login path; ignoring `proxy_auth` leaves the user unauthenticated after an otherwise successful sign-in. |
| Paths | `src/utils/storageHelper.js`, `src/pages/auth/index.js`, `src/context/UserContext.js`, `src/components/auth/WithAuth.js` |
| Tests | none automated |