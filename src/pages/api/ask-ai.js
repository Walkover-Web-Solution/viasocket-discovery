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
                const userId = parseInt(JSON.parse(req.headers['x-profile']).id);
                const countrycode = req.headers["cf-ipcountry"] || "Not available";
                const region = req.headers["cf-region"] || "Not available";
                const city = req.headers["cf-ipcity"] || "Not available";
                
                const data = await askAi(bridgeId, userMessage, {
                    ...variables,
                    user_id : userId,
                    env : process.env.NEXT_PUBLIC_NEXT_API_ENVIRONMENT,
                    countrycode : countrycode,
                    region : region,
                    city : city,
                 }, chatId)
                const botResponse = JSON.parse(data.response.data.content);
                if(bridgeId == process.env.NEXT_PUBLIC_UPDATE_PAGE_BRIDGE){
                    var shouldCreate = (botResponse.shouldCreate || "no").toLowerCase() === "yes";
                    var newBlog = await updateBlog(blogId, botResponse.blog, environment, shouldCreate,userId).catch(err => console.log('Error updating blog', err));
                }else if(bridgeId == process.env.NEXT_PUBLIC_HOME_PAGE_BRIDGE){
                    if(botResponse.blog){
                       if( typeof botResponse.blog !== 'object' ) botResponse.blog = JSON.parse(botResponse.blog)
                        const blogCreated = await createBlog(botResponse, environment, userId);
                        botResponse.urls = [blogCreated];
                    }
                }
                data.response.data.content = botResponse;
                return res.status(200).json({ success: true, data: {
                    created: shouldCreate || false, 
                    blogId: newBlog?.id, 
                    botResponse: data
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


async function updateBlog(blogId, blogData, environment, shouldCreate,userId) {
    if(shouldCreate) {
        return await blogServices.createBlog(blogData, environment,userId);
    }else{
        return await blogServices.updateBlogById(blogId, blogData, userId , environment);
    }
}

async function createBlog(botResponse, environment, userId){
    const blog = botResponse.blog;
    return await blogServices.createBlog({
        blog: blog.blogData, 
        tags: blog.tags, 
        meta: blog.meta,
        createdBy: userId,
        title: blog.blogData.find(section => section.section === 'title').content
    }, environment);
}