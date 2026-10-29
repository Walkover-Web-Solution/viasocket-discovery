import fs from "fs";
import path from "path";
import { discoveryUrl } from "@/lib/site";

const CONTENT_DIR = path.join(process.cwd(), "content", "compare");
const SLUG_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function asString(value) {
  if (value == null) return "";
  return String(value).trim();
}

export function isSafeSlug(slug) {
  return typeof slug === "string" && SLUG_PATTERN.test(slug);
}

function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(parseInt(code, 16)),
    )
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&amp;/gi, "&");
}

function stripTags(html) {
  return decodeEntities(String(html).replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function slugify(text) {
  const slug = text
    .toLowerCase()
    .replace(/&[a-z0-9#]+;/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "section";
}

function uniqueId(base, used) {
  const root = base || "section";
  if (!used.has(root)) {
    used.add(root);
    return root;
  }
  let n = 2;
  while (used.has(`${root}-${n}`)) n += 1;
  const next = `${root}-${n}`;
  used.add(next);
  return next;
}

export function formatPublishedAt(iso) {
  const time = Date.parse(iso);
  if (!Number.isFinite(time)) return "";
  const date = new Date(time);
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

function lastmod(iso) {
  const time = Date.parse(iso);
  if (!Number.isFinite(time)) return "";
  return new Date(time).toISOString().slice(0, 10);
}

function listSlugNames() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => {
      if (!entry.isDirectory()) return false;
      if (isSafeSlug(entry.name)) return true;
      console.warn(
        `Skipping compare folder "${entry.name}": use letters, numbers, hyphens, or underscores.`,
      );
      return false;
    })
    .map((entry) => entry.name);
}

function readPageMeta(slug) {
  const metaPath = path.join(CONTENT_DIR, slug, "meta.json");
  if (!fs.existsSync(metaPath)) return null;
  try {
    const raw = fs.readFileSync(metaPath, "utf8").replace(/^\uFEFF/, "");
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("meta.json must be an object");
    }
    const title = asString(data.title) || slug;
    const description = asString(data.description);
    const canonical =
      asString(data.canonical) ||
      discoveryUrl(`/compare/${encodeURIComponent(slug)}`);
    return {
      slug,
      title,
      description,
      canonical,
      authorId: asString(data.authorId),
      authorName: asString(data.authorName),
      publishedAt: asString(data.publishedAt),
      publishedLabel: "", // dates are not shown on compare pages; publishedAt still feeds sorting and schema
      category: asString(data.category),
    };
  } catch (error) {
    console.error(`Skipping compare page "${slug}": ${error.message}`);
    return null;
  }
}

function byNewest(a, b) {
  const aTime = Date.parse(a.publishedAt);
  const bTime = Date.parse(b.publishedAt);
  const aOk = Number.isFinite(aTime);
  const bOk = Number.isFinite(bTime);
  if (aOk && bOk && aTime !== bTime) return bTime - aTime;
  if (aOk !== bOk) return aOk ? -1 : 1;
  return a.title.localeCompare(b.title);
}

export function addHeadingIds(html) {
  const used = new Set();
  const headings = [];
  const nextHtml = String(html).replace(
    /<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi,
    (_, attrs, inner) => {
      const text = stripTags(inner);
      const idMatch = String(attrs).match(/\sid\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
      const existing = idMatch ? idMatch[1] || idMatch[2] || "" : "";
      const id = uniqueId(existing || slugify(text), used);
      headings.push({ id, text: text || id });
      const attrsWithoutId = String(attrs).replace(
        /\s(?:id)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i,
        "",
      );
      return `<h2${attrsWithoutId} id="${escapeAttr(id)}">${inner}</h2>`;
    },
  );
  return { html: nextHtml, headings };
}

export function extractFaqs(html) {
  const faqs = [];
  const detailsRe = /<details\b[^>]*>([\s\S]*?)<\/details>/gi;
  let match;
  while ((match = detailsRe.exec(String(html)))) {
    const block = match[1];
    const summaryRe = /<summary\b[^>]*>([\s\S]*?)<\/summary>/i;
    const summaryMatch = block.match(summaryRe);
    if (!summaryMatch) continue;
    const question = stripTags(summaryMatch[1]);
    const answer = stripTags(block.replace(summaryRe, ""));
    if (!question || !answer) continue;
    faqs.push({ question, answer });
  }
  return faqs;
}

export function wrapTables(html) {
  const source = String(html);
  const pattern = /<table\b[^>]*>[\s\S]*?<\/table>/gi;
  const matches = [];
  let match;
  while ((match = pattern.exec(source))) {
    matches.push({
      start: match.index,
      end: pattern.lastIndex,
      html: match[0],
    });
  }
  if (!matches.length) return source;

  let out = "";
  let cursor = 0;
  let index = 0;
  while (index < matches.length) {
    out += source.slice(cursor, matches[index].start);
    let end = index + 1;
    while (
      end < matches.length &&
      /^\s*$/.test(source.slice(matches[end - 1].end, matches[end].start))
    ) {
      end += 1;
    }
    const group = matches.slice(index, end);
    const cards = group
      .map((item) => `<div class="discovery-compare-table">${item.html}</div>`)
      .join("");
    out +=
      group.length > 1
        ? `<div class="discovery-compare-table-row">${cards}</div>`
        : cards;
    cursor = group[group.length - 1].end;
    index = end;
  }
  out += source.slice(cursor);
  return out;
}

export function prepareCompareHtml(html) {
  const withHeadings = addHeadingIds(html);
  return {
    html: wrapTables(withHeadings.html),
    headings: withHeadings.headings,
  };
}

function jsonLdScript(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildCompareJsonLd(page) {
  const author = {
    "@type": "Person",
    name: page.authorName || "viaSocket",
  };
  if (page.authorId) {
    author.url = discoveryUrl(`/user/${encodeURIComponent(page.authorId)}`);
  }
  const graph = [
    {
      "@type": "Article",
      headline: page.title,
      description: page.description,
      datePublished: page.publishedAt,
      author,
      mainEntityOfPage: page.canonical,
      url: page.canonical,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Discovery",
          item: discoveryUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Compare",
          item: discoveryUrl("/compare"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: page.title,
          item: page.canonical,
        },
      ],
    },
  ];
  if (page.faqs?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: page.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }
  return jsonLdScript({
    "@context": "https://schema.org",
    "@graph": graph,
  });
}

export function getCompareSummaries() {
  return listSlugNames()
    .map((slug) => readPageMeta(slug))
    .filter(Boolean)
    .sort(byNewest);
}

export function getComparePagesByAuthor(authorId) {
  const id = asString(authorId);
  if (!id) return [];
  return getCompareSummaries().filter((page) => page.authorId === id);
}

export function getComparePage(slug) {
  if (!isSafeSlug(slug)) return null;
  const summary = readPageMeta(slug);
  if (!summary) return null;
  const bodyPath = path.join(CONTENT_DIR, slug, "body.html");
  const body = fs.existsSync(bodyPath) ? fs.readFileSync(bodyPath, "utf8") : "";
  const prepared = prepareCompareHtml(body);
  const faqs = extractFaqs(body);
  const page = {
    ...summary,
    html: prepared.html,
    headings: prepared.headings,
    faqs,
  };
  return { ...page, jsonLd: buildCompareJsonLd(page) };
}

export function getCompareLlm(slug) {
  if (!isSafeSlug(slug)) return null;
  const summary = readPageMeta(slug);
  if (!summary) return null;
  const llmPath = path.join(CONTENT_DIR, slug, "llm.txt");
  const llmText = fs.existsSync(llmPath) ? fs.readFileSync(llmPath, "utf8") : "";
  return { ...summary, llmText };
}

export function renderLlmsTxt() {
  const pages = getCompareSummaries();
  const lines = [
    "# viaSocket Discovery comparisons",
    "Side-by-side comparisons of tools on viaSocket Discovery.",
    "",
  ];
  pages.forEach((page) => {
    const label = page.title.replace(/[\[\]\r\n]+/g, " ").trim() || page.slug;
    lines.push(
      `- [${label}](${discoveryUrl(`/compare/${encodeURIComponent(page.slug)}/llm.txt`)})`,
    );
  });
  return `${lines.join("\n")}\n`;
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function renderSitemapXml() {
  const pages = getCompareSummaries();
  const urls = [
    {
      loc: discoveryUrl("/compare"),
      lastmod: pages[0] ? lastmod(pages[0].publishedAt) : "",
    },
    ...pages.map((page) => ({
      loc: discoveryUrl(`/compare/${encodeURIComponent(page.slug)}`),
      lastmod: lastmod(page.publishedAt),
    })),
  ];
  const body = urls
    .map((url) => {
      const modified = url.lastmod
        ? `\n    <lastmod>${xmlEscape(url.lastmod)}</lastmod>`
        : "";
      return `  <url>\n    <loc>${xmlEscape(url.loc)}</loc>${modified}\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
