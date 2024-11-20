import { askAi, sendAlert, ValidateAiResponse } from '@/utils/utils';
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
                const countrycode = req.headers["cf-ipcountry"] || "Not available";
                const region = req.headers["cf-region"] || "Not available";
                const city = req.headers["cf-ipcity"] || "Not available";
                
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
                    botResponse =  ValidateAiResponse(parsedContent,updateBlogSchema);
                    if(botResponse.success===true){
                        botResponse= botResponse.value;
                    } else {
                        sendAlert(botResponse.errorMessages, bridgeId, message_id, chatId)
                        botResponse = await retryResponse(bridgeId, botResponse.errorMessages, userId, countrycode, region, city, updateBlogSchema, chatId, variables );
                    }
                    var shouldCreate = (botResponse.shouldCreate || "no").toLowerCase() === "yes";
                    var newBlog = await updateBlog(blogId, botResponse.blog, environment, shouldCreate,userId).catch(err => console.log('Error updating blog', err));
                }else if(bridgeId === process.env.NEXT_PUBLIC_HOME_PAGE_BRIDGE){
                    botResponse = ValidateAiResponse(parsedContent, searchResultsSchema);
                    if(botResponse.success===true){
                        botResponse = botResponse.value;
                    } else {
                        sendAlert(botResponse.errorMessages, bridgeId, message_id, chatId)
                        botResponse = await retryResponse(bridgeId, botResponse.errorMessages, userId, countrycode, region, city, searchResultsSchema, chatId, variables );
                    }
                    const shouldCreate = parsedContent.shouldCreate;
                    if(shouldCreate && (typeof shouldCreate !== 'string' || shouldCreate?.toLowerCase() != 'false')){
                        const newBlog = await createBlog(userMessage, environment, userId);
                        botResponse.urls = [newBlog];
                    }else{
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


async function updateBlog(blogId, blogData, environment, shouldCreate,userId) {
    if(shouldCreate) {
        return await blogServices.createBlog(blogData, environment,userId);
    }else{
        return await blogServices.updateBlogById(blogId, blogData, userId , environment);
    }
}

async function createBlog(userMessage, environment, userId){
    const threadId = Math.floor(Math.random() * 100000000);
    const data = await askAi(process.env.BLUE_PRINT_BRIDGE, userMessage,{},threadId);
    let blueprint = JSON.parse(data.response.data.content);
    const validate = ValidateAiResponse(blueprint, blueprintSchema);
    if(validate.success === false){
        sendAlert(validate.errorMessages, process.env.BLUE_PRINT_BRIDGE, data.response.data.message_id,threadId);
        blueprint = retryResponse(process.env.BLUE_PRINT_BRIDGE, errorMessage, userId,'','','',blueprintSchema,threadId);
        if(blueprint.message == 'Something went wrong! Try again') throw new Error('Invalid Response from AI');
    }
    const blogPrompt = JSON.stringify({
        title: blueprint.title,
        blog: [
            {
                heading: 'Detailed Reviews', 
                content: [{
                    "appName" : "app name", 
                    "content": "Engaging description with USP, pros, cons, personal opinions, and perhaps a fun anecdote."
                }]
            }, 
            ...blueprint.blogStructure
        ], 
        tags: [""]
    })
    let AIResponse = await askAi(process.env.ROUGH_BLOG_BRIDGE,  blogPrompt,'',threadId)
    let blogResponse = JSON.parse(AIResponse.response.data.content);
    let validateRoughtBlog = ValidateAiResponse(blogResponse, createdBlogSchema)
    if(validateRoughtBlog === false) {
        sendAlert(validateRoughtBlog.errorMessages, process.env.ROUGH_BLOG_BRIDGE, AIResponse.response.data.message_id,threadId)
        blogResponse = retryResponse(process.env.ROUGH_BLOG_BRIDGE, validateRoughtBlog.errorMessages, userId, '','','',createdBlogSchema,threadId);
        if(blogResponse.message==='Something went wrong! Try again') throw new Error('Invalid response from AI'); 
    }
    const {blog, tags} = blogResponse;
    const blogToCreate = {
        blog, 
        tags, 
        title: blueprint.title, 
        meta: blueprint.metadata, 
        createdBy: userId
    }
    return await blogServices.createBlog(blogToCreate, environment);
}



async function retryResponse(bridgeId, errorMessage, userId, countrycode, region, city, schema, chatId, variables){
    const data = await askAi(bridgeId, errorMessage, {
        ...variables,
        user_id : userId,
        env : process.env.NEXT_PUBLIC_NEXT_API_ENVIRONMENT,
        countrycode : countrycode,
        region : region,
        city : city,
        retry : true,
     }, chatId)
     const message_id = data.response.data.message_id;
     const parsedContent = JSON.parse(data.response.data.content);
     const validatedResponse =  ValidateAiResponse(parsedContent,schema,bridgeId,message_id,true,chatId,true);
     
     if(validatedResponse.success === true){
        return validatedResponse.value; 
     }
     sendAlert( `RETRY ERROR ${validatedResponse.errorMessages}`, bridgeId, message_id, chatId );
     return { message : "Something went wrong! Try again." }
}