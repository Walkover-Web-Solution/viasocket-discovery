export const SITE_ORIGIN = "https://viasocket.com";

export function discoveryUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `${SITE_ORIGIN}/discovery`;
  return `${SITE_ORIGIN}/discovery${normalized}`;
}
