import { askAi } from '@/utils/utils';
import fetch from 'node-fetch';
import blogServices from "../../services/blogServices"

export const config = {
  maxDuration: 30,
};

export default async function handler(req, res) {
    const { method } = req;
    const environment = req.headers['env'];
    console.log(JSON.stringify(req.headers),"headers")
    switch (method) {

        case 'POST': 
            try {
                const { userMessage, chatId, bridgeId, variables, blogId } = req.body;

                const data = await askAi(bridgeId, userMessage, {...variables, user_id : JSON.parse(req.headers['x-profile']).id , env : process.env.NEXT_PUBLIC_NEXT_API_ENVIRONMENT}, chatId)
                // Return the response data to the client
                if(bridgeId == process.env.NEXT_PUBLIC_UPDATE_PAGE_BRIDGE){
                    const botResponse = JSON.parse(data.response.data.content);
                    var shouldCreate = (botResponse.shouldCreate || "no").toLowerCase() === "yes";
                    var newBlog = await updateBlog(blogId, botResponse.blog, environment, shouldCreate).catch(err => console.log('Error updating blog', err));
                }
                return res.status(200).json({ success: true, data: {
                    created: shouldCreate || false, 
                    blogId: newBlog?.id, 
                    response: data
                } });
            } catch (error) {
                // Return error response
                console.error("error in chatBot api ",error)
                return res.status(400).json({ success: false, error: error.message });
            }
        default:
            // Handle unsupported request methods
            return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}


async function updateBlog(blogId, blogData, environment, shouldCreate) {
    if(shouldCreate) {
        return await blogServices.createBlog(blogData, environment);
    }else{
        return await blogServices.updateBlogById(blogId, blogData, environment);
    }
}