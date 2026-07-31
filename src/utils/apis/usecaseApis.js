import axios from '@/utils/interceptor';
import { toast } from 'react-toastify';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const proxyUrl = process.env.NEXT_PUBLIC_PROXY_URL;

export const createUsecase = async (apps, message) => {
  try {
    const response = await axios.post(proxyUrl + '/api/usecases', { apps, message });
    return response?.data?.data;
  } catch (error) {
    console.error('Failed to create usecase:', error);
    return null;
  }
};

export const fetchUsecasesByUser = async (userId) => {
  try {
    const response = await axios.get(proxyUrl + `/api/usecases?userId=${userId}`);
    return response?.data?.data || [];
  } catch (error) {
    console.error('Failed to fetch usecases:', error);
    return [];
  }
};

export const postUsecaseComment = async (usecaseId, comment) => {
  try {
    const response = await axios.post(proxyUrl + `/api/usecases/${usecaseId}/comments`, {
      text: comment,
    });
    toast.success('Comment posted successfully');
    return response.data.data.comment;
  } catch (error) {
    console.error('Failed to post comment:', error);
    toast.error('Failed to post comment');
    return false;
  }
};

export const deleteUsecaseComment = async (commentId, usecaseId) => {
  try {
    await axios.delete(proxyUrl + `/api/usecases/${usecaseId}/comments/${commentId}`);
    return true;
  } catch (error) {
    console.error('Failed to delete comment:', error);
    toast.error('Failed to delete comment');
    return false;
  }
};
