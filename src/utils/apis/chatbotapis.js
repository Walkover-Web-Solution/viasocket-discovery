
export const maxDuration = 300
import axios from "../interceptor";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export const sendMessageApi = async (content, chatId) => {
    const response = await axios.post(baseUrl+'/api/ask-ai', {
        userMessage: content,
        chatId: chatId,
    });

    return response?.data?.data;

};


export const getAllPreviousMessages = async (chatId) => {
    const response = await axios.get(baseUrl+`/api/gethistory?chatId=${chatId}`);

    return response?.data?.data;

};

export const compareBlogs = async (variables) => {
    const response = await axios.post(baseUrl+`/api/compare-blogs`, variables)
    return response?.data?.response?.data;
}