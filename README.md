# viaSocket Discovery

Next.js 14 (pages router) app served at `https://viasocket.com/discovery`. It hosts AI-written app-discovery blogs (stored in MongoDB) and file-based compare pages.

## Getting started

```bash
npm install
npm run dev
```

Open the dev server (port 3000) at the `/discovery` path. `next.config.js` sets that base path, so `/` returns 404. Blog, chat, and login flows need server-side secrets. See [docs/development.md](docs/development.md) for commands and checks, and [docs/architecture.md](docs/architecture.md) for how the app is built.

## Compare pages

Comparison pages are files in this repo, generated at build time. A new page is a new folder. It does not need a code change.

Create `content/compare/<slug>/` with:

- `meta.json` — `title`, `description`, `canonical`, `authorId`, `authorName`, `publishedAt` (ISO date), `category`, and optionally `readMinutes` (shown as "N min read"). Existing files also carry `h1`, which no code reads.
- `body.html` — the article. Give each `h2` an `id`; those ids become the "On this page" index. Put questions in `details`/`summary` blocks so they can be read as an FAQ. Tables that follow one another, with only whitespace between them, render side by side.
- `llm.txt` — the same article as plain text for AI agents

`authorId` is the Discovery user id. The byline links to `/discovery/user/<authorId>`, and that author's page lists their comparisons next to their blogs.

The suggestion box at the end of every article is part of the template. It is not written into the page folder.

The slug is the folder name: letters, numbers, hyphens, or underscores. Routes, with the `/discovery` base path:

- `/discovery/compare` lists every page, newest first
- `/discovery/compare/<slug>` is the article
- `/discovery/compare/<slug>/llm.txt` serves `llm.txt` as plain text
- `/discovery/llms.txt` is a plain-text index of those text files

`/discovery/sitemap.xml` includes the compare index and each comparison. `/discovery/robots.txt` allows them, but crawlers read the host-level `https://viasocket.com/robots.txt`. Ship the folder on the next build and the page is live. A slug without `meta.json` is skipped.

## Progress tracker

`STATUS.md` is the scorecard for this repo. The rule for keeping it current and the `npm run status:check` gate are in [AGENTS.md](AGENTS.md#progress-tracker).
