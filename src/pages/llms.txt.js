export default function LlmsTxtPage() {
  return null;
}

export async function getServerSideProps({ res }) {
  const { renderLlmsTxt } = await import("@/lib/compareContent");
  const { guideLlmsLines } = await import("@/lib/guideContent");
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.write(renderLlmsTxt(guideLlmsLines()));
  res.end();
  return { props: {} };
}
