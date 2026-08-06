import { getAppsByCategory } from "@/services/integrationServices";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { category = "All" } = req.query;

  try {
    const apps = await getAppsByCategory(category);
    return res.status(200).json({ success: true, data: apps });
  } catch (error) {
    console.error("Error fetching plugins:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
