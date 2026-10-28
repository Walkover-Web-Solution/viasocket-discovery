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

## Compare pages

Comparison pages are files in this repo, generated at build time. A new page is a new folder. It does not need a code change.

Create `content/compare/<slug>/` with:

- `meta.json` — `title`, `description`, `canonical`, `authorId`, `authorName`, `publishedAt` (ISO date), and `category`
- `body.html` — the article. Give each `h2` an `id`; those ids become the "On this page" index. Put questions in `details`/`summary` blocks so they can be read as an FAQ. Tables that follow one another, with only whitespace between them, render side by side.
- `llm.txt` — the same article as plain text for AI agents

`authorId` is the Discovery user id. The byline links to `/discovery/user/<authorId>`, and that author's page lists their comparisons next to their blogs.

The suggestion box at the end of every article is part of the template. It is not written into the page folder.

The slug is the folder name: letters, numbers, hyphens, or underscores. Routes, with the `/discovery` base path:

- `/discovery/compare` lists every page, newest first
- `/discovery/compare/<slug>` is the article
- `/discovery/compare/<slug>/llm.txt` serves `llm.txt` as plain text
- `/discovery/llms.txt` is a plain-text index of those text files

`/discovery/sitemap.xml` includes the compare index and each comparison. `/discovery/robots.txt` allows them. Ship the folder on the next build and the page is live. `content/compare/sample/` is a placeholder so the routes can be reviewed.
