export default function SitemapPage() {
  return null;
}

export async function getServerSideProps({ res }) {
  const { renderSitemapXml } = await import("@/lib/compareContent");
  const { guideSitemapEntries } = await import("@/lib/guideContent");
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.write(renderSitemapXml(guideSitemapEntries()));
  res.end();
  return { props: {} };
}
