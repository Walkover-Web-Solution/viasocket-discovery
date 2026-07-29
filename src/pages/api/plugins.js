import { getAppsByCategory } from "@/services/integrationServices";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { category = "All", limit = 40, offset = 0 } = req.query;
  const environment = req.headers["env"] || process.env.NEXT_PUBLIC_NEXT_API_ENVIRONMENT || "prod";

  try {
    const apps = await getAppsByCategory(
      category,
      parseInt(limit, 10) || 40,
      parseInt(offset, 10) || 0,
      environment,
    );
    return res.status(200).json({ success: true, data: apps });
  } catch (error) {
    console.error("Error fetching plugins:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
