import fs from "fs";
import path from "path";
import { discoveryUrl } from "@/lib/site";
import {
  extractFaqs,
  formatPublishedAt,
  isSafeSlug,
  prepareCompareHtml,
} from "@/lib/compareContent";

// Guides are file-based articles (how-tos, explainers) under /discovery/guides/<slug>.
// A guide is a folder in content/guides/<slug>/ with meta.json, body.html and llm.txt.
const CONTENT_DIR = path.join(process.cwd(), "content", "guides");

function asString(value) {
  return value == null ? "" : String(value).trim();
}

function readGuideMeta(slug) {
  const metaPath = path.join(CONTENT_DIR, slug, "meta.json");
  if (!fs.existsSync(metaPath)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(metaPath, "utf8").replace(/^\uFEFF/, ""));
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("meta.json must be an object");
    }
    return {
      slug,
      title: asString(data.h1) || asString(data.title) || slug,
      metaTitle: asString(data.title) || asString(data.h1) || slug,
      description: asString(data.description),
      canonical:
        asString(data.canonical) ||
        discoveryUrl(`/guides/${encodeURIComponent(slug)}`),
      authorId: asString(data.authorId),
      authorName: asString(data.authorName),
      publishedAt: asString(data.publishedAt),
      publishedLabel: formatPublishedAt(data.publishedAt),
      readMinutes: Number.parseInt(data.readMinutes, 10) || 0,
      category: asString(data.category) || "Guide",
    };
  } catch (error) {
    console.error(`Skipping guide "${slug}": ${error.message}`);
    return null;
  }
}

export function getGuideSummaries() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && isSafeSlug(entry.name))
    .map((entry) => readGuideMeta(entry.name))
    .filter(Boolean)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

function buildGuideJsonLd(page) {
  const author = { "@type": "Person", name: page.authorName || "viaSocket" };
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
        { "@type": "ListItem", position: 1, name: "Discovery", item: discoveryUrl("/") },
        { "@type": "ListItem", position: 2, name: page.title, item: page.canonical },
      ],
    },
  ];
  if (page.faqs.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: page.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}

export function getGuidePage(slug) {
  if (!isSafeSlug(slug)) return null;
  const summary = readGuideMeta(slug);
  if (!summary) return null;
  const bodyPath = path.join(CONTENT_DIR, slug, "body.html");
  const body = fs.existsSync(bodyPath) ? fs.readFileSync(bodyPath, "utf8") : "";
  const prepared = prepareCompareHtml(body);
  const page = { ...summary, html: prepared.html, headings: prepared.headings, faqs: extractFaqs(body) };
  return { ...page, jsonLd: buildGuideJsonLd(page) };
}

export function getGuideLlm(slug) {
  if (!isSafeSlug(slug)) return null;
  const summary = readGuideMeta(slug);
  if (!summary) return null;
  const llmPath = path.join(CONTENT_DIR, slug, "llm.txt");
  const llmText = fs.existsSync(llmPath) ? fs.readFileSync(llmPath, "utf8") : "";
  return { ...summary, llmText };
}

export function guideLlmsLines() {
  const pages = getGuideSummaries();
  if (!pages.length) return [];
  const lines = ["", "# viaSocket Discovery guides", ""];
  pages.forEach((page) => {
    const label = page.title.replace(/[\[\]\r\n]+/g, " ").trim() || page.slug;
    lines.push(`- [${label}](${discoveryUrl(`/guides/${encodeURIComponent(page.slug)}/llm.txt`)})`);
  });
  return lines;
}

export function guideSitemapEntries() {
  return getGuideSummaries().map((page) => ({
    loc: discoveryUrl(`/guides/${encodeURIComponent(page.slug)}`),
    lastmod: Number.isFinite(Date.parse(page.publishedAt))
      ? new Date(page.publishedAt).toISOString().slice(0, 10)
      : "",
  }));
}
