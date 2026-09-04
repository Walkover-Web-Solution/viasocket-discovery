import axios from "@/utils/interceptor";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// limit defaults to a full page because callers that want the catalogue for
// name lookups rather than for the grid rely on getting more than a handful
export const fetchApps = async (
  category = "All",
  limit = 200,
  offset = 0,
  search = "",
) => {
  try {
    const response = await axios.get(`${baseUrl}/api/plugins`, {
      params: { category, limit, offset, search },
    });
    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching apps:", error);
    return [];
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/tags`, {
      params: { method: 'GET' },
    });
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
