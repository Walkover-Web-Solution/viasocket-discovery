# viaSocket Automation Ideas

Next.js app (pages router) for **automation use cases** and related AI blogs, served at **`https://viasocket.com/automation-ideas`**. MongoDB holds live content; see [docs/architecture.md](docs/architecture.md) for routes and data model.

Agents and contributors: start with [AGENTS.md](AGENTS.md). Feature status lives in [STATUS.md](STATUS.md).

## Getting started

```bash
npm install
npm run dev
```

Open the dev server on port 3000 at the `/automation-ideas` base path. Server-only secrets (Mongo, MSG91, GTWY, use-case agent ids) are required for full flows — see [docs/development.md](docs/development.md) and [docs/security-and-operations.md](docs/security-and-operations.md).

| Command | Purpose |
| --- | --- |
| `npm run build` | Production build |
| `npm run build:production` | Build using committed `.env.production` (Docker image) |
| `npm run lint` | ESLint |
| `npm run status:check` | Ensures `STATUS.md` stays current when code changes |

## Experiments

A/B recording lives in `src/utils/experiments.js`. The running UI is the Pages Router (`src/pages`). **No page imports the helpers yet** — nothing on screen changes, and no experiment is started. The owner defines experiments in the middleware.

```js
import { mwVariant, mwSend } from '@/utils/experiments';

const variant = await mwVariant('experiment-key');
await mwSend('exposure', { experiment: 'experiment-key', variant });
await mwSend('conversion', { experiment: 'experiment-key', variant });
```

`mwVariant` returns `null` until the middleware assigns a variant. Set before build:

- `NEXT_PUBLIC_MW_EVENTS_URL` — events URL
- `NEXT_PUBLIC_MW_KEY` — bearer write key

Use `.env.local` for `next dev`; production image uses `npm run build:production` (`.env.production`). Do not commit secret values.

## Documentation map

| Doc | Contents |
| --- | --- |
| [docs/architecture.md](docs/architecture.md) | Routes, APIs, Mongo models, integrations |
| [docs/development.md](docs/development.md) | Setup, commands, manual verification |
| [docs/security-and-operations.md](docs/security-and-operations.md) | Auth, secrets, SEO, deploy |
| [docs/maintenance.md](docs/maintenance.md) | Coverage map and docs run history |