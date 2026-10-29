import { discoveryUrl } from "@/lib/site";

const ROBOTS = `User-agent: *
Allow: /
Allow: /discovery/compare
Allow: /discovery/compare/
Allow: /discovery/llms.txt

Sitemap: ${discoveryUrl("/sitemap.xml")}
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
