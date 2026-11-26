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