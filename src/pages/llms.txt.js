export default function LlmsTxtPage() {
  return null;
}

export async function getServerSideProps({ res }) {
  const { renderLlmsTxt } = await import("@/lib/compareContent");
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.write(renderLlmsTxt());
  res.end();
  return { props: {} };
}
