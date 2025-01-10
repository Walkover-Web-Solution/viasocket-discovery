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

export const postComment = async (blogId, comment) => {
  try{
    const response = await axios.post(proxyUrl + `/api/blog/${blogId}/comments`, {
      text: comment
    });
    toast.success('Comment posted successfully');
    return response.data.data.comment;
  }catch(error){
    console.error('Failed to post comment:', error);
    toast.error('Failed to post comment');
    return false;
  }
}
