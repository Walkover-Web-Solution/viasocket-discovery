function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
  const body = `${JSON.stringify(payload)}\n`;
  res.write(body);
  res.end();
}

export default function CompareIndexJsonPage() {
  return null;
}

export async function getServerSideProps({ res }) {
  const { buildCompareIndexJson } = await import("@/lib/compareContent");
  sendJson(res, 200, buildCompareIndexJson());
  return { props: {} };
}