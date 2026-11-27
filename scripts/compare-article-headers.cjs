const fs = require("fs");
const path = require("path");

const SITE_ORIGIN = "https://viasocket.com";
const SLUG_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
const CONTENT_DIR = path.join(process.cwd(), "content", "compare");

function discoveryUrl(route = "/") {
  const normalized = route.startsWith("/") ? route : `/${route}`;
  if (normalized === "/") return `${SITE_ORIGIN}/discovery`;
  return `${SITE_ORIGIN}/discovery${normalized}`;
}

function listSlugs() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && SLUG_PATTERN.test(entry.name))
    .map((entry) => entry.name);
}

function buildCompareArticleLinkHeaders() {
  return listSlugs().map((slug) => {
    const encoded = encodeURIComponent(slug);
    const links = [
      `<${discoveryUrl(`/compare/${encoded}/llm.txt`)}>; rel="alternate"; type="text/plain"`,
    ];
    if (fs.existsSync(path.join(CONTENT_DIR, slug, "data.json"))) {
      links.push(
        `<${discoveryUrl(`/compare/${encoded}/data.json`)}>; rel="alternate"; type="application/json"`,
      );
    }
    return {
      source: `/compare/${slug}`,
      headers: [{ key: "Link", value: links.join(", ") }],
    };
  });
}

module.exports = { buildCompareArticleLinkHeaders };