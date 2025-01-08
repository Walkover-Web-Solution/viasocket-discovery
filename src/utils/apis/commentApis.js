import axios from '@/utils/interceptor'
import { toast } from 'react-toastify';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const proxyUrl = process.env.NEXT_PUBLIC_PROXY_URL;


export const deleteComment = async (commentId,blogId) => {
  try {
    await axios.delete(proxyUrl + `/api/blog/${blogId}/comments/${commentId}`);
    return true;
  } catch (error) {
    console.error('Failed to delete comment:', error);
    toast.error('Failed to delete comment');
    return false;
  }
};
