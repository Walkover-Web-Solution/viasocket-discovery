import axios from "@/utils/interceptor";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const plugServiceUrl = process.env.NEXT_PUBLIC_PLUG_SERVICE_URL;

export const fetchApps = async (category = "", limit = 200, offset = 0) => {
  try {
    const response = await axios.get(`${plugServiceUrl}/api/v1/plugins/all`, {
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
    const response = await axios.get(`${baseUrl}/api/tags`);
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
