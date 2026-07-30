import axios from "@/utils/interceptor";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const fetchApps = async (category = "All", limit = 20, offset = 0) => {
  try {
    const response = await axios.get(`${baseUrl}/api/plugins`, {
      params: { category, limit, offset },
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
