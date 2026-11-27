export default function LlmsFullTxtPage() {
  return null;
}

export async function getServerSideProps({ res }) {
  const { renderLlmsFullTxt } = await import("@/lib/compareContent");
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
  res.write(renderLlmsFullTxt());
  res.end();
  return { props: {} };
}