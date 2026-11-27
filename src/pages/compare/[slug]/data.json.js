function sendJson(res, statusCode, payload, { cache = false } = {}) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (cache) {
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
  }
  const body =
    typeof payload === "string" ? payload : `${JSON.stringify(payload)}\n`;
  res.write(body);
  res.end();
}

export default function CompareDataJsonPage() {
  return null;
}

export async function getServerSideProps({ res, params }) {
  const { isSafeSlug, getCompareData } = await import("@/lib/compareContent");
  const slug = params.slug;
  if (!isSafeSlug(slug)) {
    sendJson(res, 404, { error: "not_found" });
    return { props: {} };
  }
  const data = getCompareData(slug);
  if (!data) {
    sendJson(res, 404, { error: "not_found" });
    return { props: {} };
  }
  sendJson(res, 200, data, { cache: true });
  return { props: {} };
}