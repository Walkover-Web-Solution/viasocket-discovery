import axios from '@/utils/interceptor'

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export const SearchBlogs = async (search) => {
  const response = await axios.get(baseUrl + '/api/blog', { params: { search } });
  return response?.data?.data;

};

export const fetchBlogs = async (token) => {
  try {
    const res = await fetch(`${baseUrl}/api/blog`, {
      method: 'GET',
      headers: {
        Authorization: token
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch blogs: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export const updateBlog = async (chatId, blogDataToPublish) => {
  try {
    const response = await axios.patch(baseUrl + `/api/blog/${chatId}`, blogDataToPublish);
    return response;
  } catch (error) {
    console.error('Failed to publish blog:', error);
    throw error;
  }
};
export const publishBlog = async (blogData = {}) => {
  try {
    const { id, _id, ...dataToSend } = blogData;
    const response = await axios.post(baseUrl + `/api/blog`, dataToSend);
    return response?.data?.data;
  } catch (error) {
    console.error('Failed to publish blog:', error);
    throw error;
  }
};