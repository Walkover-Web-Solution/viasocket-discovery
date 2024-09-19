
export const maxDuration = 300
import axios from "../interceptor";

export const sendMessageApi = async (content, chatId) => {
    const response = await axios.post('/api/ask-ai', {
        userMessage: content,
        chatId: chatId,
    });

    return response?.data?.data;

};


export const getAllPreviousMessages = async (chatId) => {
    const response = await axios.get(`/api/gethistory?chatId=${chatId}`);

    return response?.data?.data;

};

export const compareBlogs = async (variables) => {
    const response = await axios.post(`/api/compare-blogs`, variables)
    return response?.data?.response?.data;
}