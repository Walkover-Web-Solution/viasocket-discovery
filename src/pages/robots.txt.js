import { discoveryUrl } from "@/lib/site";

const AGENT_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "Amazonbot",
];

function agentAllowBlocks() {
  return AGENT_BOTS.flatMap((agent) => [
    `User-agent: ${agent}`,
    "Allow: /discovery/compare",
    "",
  ]).join("\n");
}

const ROBOTS = `User-agent: *
Allow: /
Allow: /discovery/compare
Allow: /discovery/compare/
Allow: /discovery/llms.txt

${agentAllowBlocks()}Sitemap: ${discoveryUrl("/sitemap.xml")}
`;

export default function RobotsPage() {
  return null;
}

export async function getServerSideProps({ res }) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.write(ROBOTS);
  res.end();
  return { props: {} };
}