function sendText(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.write(body);
  res.end();
}

export default function CompareLlmPage() {
  return null;
}

export async function getServerSideProps({ res, params }) {
  const { getCompareLlm } = await import("@/lib/compareContent");
  const page = getCompareLlm(params.slug);
  if (!page) {
    sendText(res, 404, "Not found\n");
    return { props: {} };
  }
  const body = page.llmText.trim()
    ? page.llmText.endsWith("\n")
      ? page.llmText
      : `${page.llmText}\n`
    : `# ${page.title}\n\n${page.description}\n`;
  sendText(res, 200, body);
  return { props: {} };
}
