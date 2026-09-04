import { getAppsByCategory } from "@/services/integrationServices";

const DEFAULT_LIMIT = 200;

// the catalogue is far larger than one response should carry, so the name match
// happens here — over every app in the category — and only the requested slice
// travels to the browser
function matchApps(apps, search) {
  const query = search.trim().toLowerCase();
  if (!query) return apps;

  const matched = apps.filter((app) =>
    app?.name?.toLowerCase().includes(query),
  );

  // an app whose name starts with the query is the one the visitor meant, so
  // keep it inside the first page of results
  return matched.sort((a, b) => {
    const rank = (name) => (name.toLowerCase().startsWith(query) ? 0 : 1);
    return rank(a.name) - rank(b.name);
  });
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { category = "All", limit, offset, search = "" } = req.query;

  try {
    const apps = await getAppsByCategory(category);
    const matched = matchApps(apps, String(search));

    const start = Math.max(0, Number(offset) || 0);
    const size = Number(limit) > 0 ? Number(limit) : DEFAULT_LIMIT;
    const page = matched.slice(start, start + size);

    return res
      .status(200)
      .json({ success: true, data: page, total: matched.length });
  } catch (error) {
    console.error("Error fetching plugins:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
