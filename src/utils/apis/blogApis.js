import axios from '@/utils/interceptor'

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export const SearchBlogs = async (searchQuery) => {
  try {
    const response = await axios.get(`https://socket-plug-services-h7duexlbuq-el.a.run.app/discovery/search?search=${searchQuery}`);
    return response.data.data;
  }catch (err) {
    console.log("error getting search results ", err);
  }
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
export const getBlogById = async (blogId) => {
  try {
    const response = await axios.get(baseUrl + `/api/blog/${blogId}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to get blog:', error);
  }
};