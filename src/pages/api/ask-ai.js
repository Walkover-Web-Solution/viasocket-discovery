import { askAi, createBlogPrompt, ValidateAiResponse } from '@/utils/utils';
import blogServices from "../../services/blogServices"
import { blueprintSchema, createdBlogSchema, searchResultsSchema, updateBlogSchema } from '@/utils/schema';
import { updateProxyUser } from '@/services/proxyServices';

export const config = {
  maxDuration: 30,
};

export default async function handler(req, res) {
    const { method } = req;
    const environment = req.headers['env'];
    const userData = req.headers['x-profile'];
    switch (method) {

        case 'POST': 
            try {
                const { userMessage, chatId, bridgeId, variables, blogId } = req.body;
                const userId = parseInt(JSON.parse(req.headers['x-profile']).id);
                const countrycode = req.headers["cf-ipcountry"] || "IN";
                const region = req.headers["cf-region"] || "IN";
                const city = req.headers["cf-ipcity"] || "IN";
                
                const data = await askAi(
                  bridgeId, userMessage,
                  {
                    ...variables,
                    user_id: userId,
                    env: process.env.NEXT_PUBLIC_NEXT_API_ENVIRONMENT,
                    countrycode: countrycode,
                    region: region,
                    city: city,
                  }, 
                  chatId
                );
                const message_id = data.response.data.message_id;
                const parsedContent = JSON.parse(data.response.data.content);
                let botResponse = parsedContent;

                if(bridgeId === process.env.NEXT_PUBLIC_UPDATE_PAGE_BRIDGE){
                    botResponse =  ValidateAiResponse(parsedContent,updateBlogSchema,bridgeId,message_id,true,chatId);
                    var shouldCreate = (botResponse.shouldCreate || "no").toLowerCase() === "yes";
                    var newBlog = await updateBlog(blogId, botResponse.blog, environment, shouldCreate,userId,countrycode).catch(err => console.log('Error updating blog', err));
                }else if(bridgeId === process.env.NEXT_PUBLIC_HOME_PAGE_BRIDGE){
                    botResponse = ValidateAiResponse(parsedContent, searchResultsSchema, bridgeId, message_id, true, chatId);
                    const shouldCreate = parsedContent.shouldCreate;
                    if(shouldCreate && (typeof shouldCreate !== 'string' || shouldCreate?.toLowerCase() != 'false')){
                        const newBlog = await createBlog(userMessage, environment, userId,countrycode);
                        botResponse.urls = [newBlog];
                    }else{
                        botResponse = ValidateAiResponse(parsedContent, searchResultsSchema, bridgeId, message_id, true, chatId);
                        botResponse.urls = botResponse.existingBlogs;    
                        delete botResponse.existingBlogs;
                    }
                } else if(bridgeId === process.env.NEXT_PUBLIC_USER_BIO_BRIDGE){
                    if(parsedContent.bio){
                        const userMeta = userData.meta || {};
                        await updateProxyUser(userId, {meta: {...userMeta, bio: parsedContent.bio}} );
                    }
                    botResponse = parsedContent;
                }else{
                    botResponse = parsedContent;
                }
                return res.status(200).json({ success: true, data: {
                    created: shouldCreate || false, 
                    blogId: newBlog?.id, 
                    botResponse
                }});
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


async function updateBlog(blogId, blogData, environment, shouldCreate,userId,countrycode) {
    if(shouldCreate) {
        return await blogServices.createBlog({...blogData , countryCode : countrycode , createdBy : userId}, environment);
    }else{
        return await blogServices.updateBlogById(blogId, blogData, userId , environment);
    }
}

async function createBlog(userMessage, environment, userId, countrycode){
    const blueprint = JSON.parse(await askAi(process.env.BLUE_PRINT_BRIDGE, userMessage).then(res => res.response.data.content));
    if(ValidateAiResponse(blueprint, blueprintSchema, process.env.BLUE_PRINT_BRIDGE, null, true).corrupted) throw new Error('Invalid Response from AI');
    const blogPrompt = JSON.stringify({
        title: blueprint.title,
        blog: [
            {
                heading : 'Comparison Table: <about app>',
                content :"Provide a comparative table use internal links to the real app  "
            },
            {
                heading: 'Detailed Reviews', 
                content: [{
                    "appName" : "app name", 
                    "content": "Engaging description with USP, pros, cons,personal opinions, and perhaps a fun anecdote in proper markdown."
                }]
            }, 
            ...blueprint.blogStructure
        ], 
        tags: [""]
    })
    const blogResponse = JSON.parse(await askAi(process.env.ROUGH_BLOG_BRIDGE, createBlogPrompt + blogPrompt).then(res => res.response.data.content));
    if(ValidateAiResponse(blogResponse, createdBlogSchema, process.env.ROUGH_BLOG_BRIDGE, null, true).corrupted) throw new Error('Invalid Response from AI');
    const {blog, tags} = blogResponse;
    const blogToCreate = {
        blog, 
        tags, 
        title: blueprint.title, 
        meta: blueprint.metadata, 
        createdBy: userId,
        countryCode : countrycode
    }
    return await blogServices.createBlog(blogToCreate, environment);
}

