This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Experiments

A/B recording lives in one shared module, `src/utils/experiments.js`. The running UI is the Pages Router (`src/pages`), so any page imports the helpers from there. No page calls them yet: nothing on screen changes, and no experiment is started. The owner defines experiments in the middleware.

```js
import { mwVariant, mwSend } from '@/utils/experiments';

const variant = await mwVariant('experiment-key');
await mwSend('exposure', { experiment: 'experiment-key', variant });
await mwSend('conversion', { experiment: 'experiment-key', variant });
```

`mwVariant` returns `null` until the middleware assigns a variant. It does not pick one itself. Set these in the environment before building. Next.js inlines `NEXT_PUBLIC_` values at build time, and the values must not be written into source:

- `NEXT_PUBLIC_MW_EVENTS_URL` — events URL
- `NEXT_PUBLIC_MW_KEY` — write key sent as `Authorization: Bearer`

Put them in `.env.local` for local `next dev`. The production image runs `npm run build:production`, which loads `.env.production`.
