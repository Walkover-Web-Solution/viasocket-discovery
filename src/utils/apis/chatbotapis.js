
export const maxDuration = 300
import axios from "../interceptor";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const proxyUrl = process.env.NEXT_PUBLIC_PROXY_URL;

export const sendMessageApi = async (content, chatId, bridgeId, variables, blogId) => {
    const response = await axios.post(proxyUrl+'/api/ask-ai', {
        userMessage: content,
        chatId: chatId,
        bridgeId : bridgeId, 
        variables : variables, 
        blogId: blogId
    });

    return response?.data?.data;

};


export const getAllPreviousMessages = async (chatId, bridgeId) => {
    const response = await axios.get(proxyUrl+`/api/gethistory?chatId=${chatId}&bridgeId=${bridgeId}`);
    return response?.data?.data;
};

export const compareBlogs = async (variables) => {
    const response = await axios.post(baseUrl+`/api/compare-blogs`, variables)
    return response?.data?.response?.data;
}