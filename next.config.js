/** @type {import('next').NextConfig} */
const { buildCompareArticleLinkHeaders } = require("./scripts/compare-article-headers.cjs");

module.exports = {
  basePath: "/discovery",
  async headers() {
    return buildCompareArticleLinkHeaders();
  },
};