import { askAi, reFormat, sendAlert, ValidateAiResponse } from '@/utils/utils';
import blogServices from "../../services/blogServices"
import { blueprintSchema, createdBlogSchema, searchResultsSchema, updateBlogSchema } from '@/utils/schema';
import { updateProxyUser } from '@/services/proxyServices';
const _ = require('lodash'); 

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
                    botResponse =  ValidateAiResponse(parsedContent,updateBlogSchema);
                    if(botResponse.success===true){
                            botResponse= botResponse.value;
                        } else {
                                sendAlert(botResponse.errorMessages, bridgeId, message_id, chatId)
                                botResponse = await retryResponse(bridgeId, botResponse.errorMessages, userId, countrycode, region, city, updateBlogSchema, chatId, variables );
                            }
                            var shouldCreate = (botResponse.shouldCreate || "no").toLowerCase() === "yes";
                            if (botResponse?.operations?.length > 0) botResponse.blog = applyOperations(botResponse.operations, variables.blogData);
                    var newBlog = await updateBlog(blogId, botResponse.blog, environment, shouldCreate,userId,countrycode).catch(err => console.log('Error updating blog', err));
                    if(newBlog){
                        botResponse.blog = newBlog;
                    }
                    if(botResponse.existingBlogs) {
                        botResponse.urls = botResponse.existingBlogs;    
                        delete botResponse.existingBlogs;
                    }
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
                        const newBlog = await createBlog(userMessage, environment, userId,countrycode);
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


async function updateBlog(blogId, blogData, environment, shouldCreate,userId,countrycode) {
    if(shouldCreate) {
        return await blogServices.createBlog({...blogData , countryCode : countrycode , createdBy : userId}, environment);
    }else{
        return await blogServices.updateBlogById(blogId, blogData, userId , environment);
    }
}

export async function createBlog(userMessage, environment, userId, countrycode){
    const threadId = Math.floor(Math.random() * 100000000);
    const data = await askAi(process.env.BLUE_PRINT_BRIDGE, userMessage,{},threadId);
    let blueprint = JSON.parse(data.response.data.content);
    const validate = ValidateAiResponse(blueprint, blueprintSchema);
    if(validate.success === false){
        sendAlert(validate.errorMessages, process.env.BLUE_PRINT_BRIDGE, data.response.data.message_id,threadId);
        blueprint = await retryResponse(process.env.BLUE_PRINT_BRIDGE, errorMessage, userId,'','','',blueprintSchema,threadId);
        if(blueprint.message == 'Something went wrong! Try again') throw new Error('Invalid Response from AI');
    }
    let hasDetailedReview = false;
    let blogPrompt = {
        title: blueprint.title,
        blog: [
            {
                "heading": "Comparison Table: <Add some description about table here>",
                "content": "Compare the features, pricing, and benefits of all apps with each other . Use internal links to direct users to real app pages for detailed insights."
              },
            ...((blueprint.blogStructure).map((section)=>{
                if(section?.section === 'detailed_reviews'){
                    hasDetailedReview = true;
                    section.content = [detailedReviewContent];
                    delete section.what_to_cover;

                }
                return section;
            })),
             {
                section : "FAQ",
                heading : "Frequently Asked Questions",
                content : [
                    {
                        question:"",
                        answer:"",
                    }
                ]
            },
        ], 
        tags: [""]
    }
    if(!hasDetailedReview){
        blogPrompt.blog.push({
            "heading": "Detailed Reviews",
            "section": "detailed_reviews",
            "content": [detailedReviewContent]
        })
    }
    blogPrompt = reFormat(blogPrompt);
    blogPrompt = JSON.stringify(blogPrompt);
    let AIResponse = await askAi(process.env.ROUGH_BLOG_BRIDGE,  blogPrompt,'',threadId)
    let blogResponse = JSON.parse(AIResponse.response.data.content);
    let validateRoughtBlog = ValidateAiResponse(blogResponse, createdBlogSchema)
    if(validateRoughtBlog.success === false) {
        sendAlert(validateRoughtBlog.errorMessages, process.env.ROUGH_BLOG_BRIDGE, AIResponse.response.data.message_id,threadId)
        blogResponse = await retryResponse(process.env.ROUGH_BLOG_BRIDGE, validateRoughtBlog.errorMessages, userId, '','','',createdBlogSchema,threadId);
        if(blogResponse.message==='Something went wrong! Try again') throw new Error('Invalid response from AI'); 
    }
    const {blog, tags} = blogResponse;
    const blogToCreate = {
        blog, 
        tags, 
        title: blueprint.title,
        titleDescription : blueprint.title_description , 
        meta: blueprint.metadata, 
        createdBy: userId,
        countryCode : countrycode
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

const detailedReviewContent = {
    "appName": "App Name",
    "content": "Explore App in detail, including its standout features, benefits, and how it uniquely addresses specific user needs. Focus on practical solutions and real-world use cases. Conclude with a bullet-point list of key pros and cons to help users make informed decisions."
};




function applyOperations(operations, blog) {
    const updatedBlog = blog;
    operations.forEach((operation) => {
        const { data, operation: type } = operation;

        
         switch (type) {
            case "add_content":
                const newSection = {
                    heading: data.heading,
                    content: data.content,
                };
                updatedBlog.blog.splice(data.position, 0, newSection);
                break;

            case "remove_content":
                if (updatedBlog.blog[data.position].section !== 'detailed_reviews') {
                    updatedBlog.blog.splice(data.position, 1);
                } else {
                    throw Error('cannot remove detailed_reviews section at position');
                }
                break;

            case "add_app":
                const detailedReviews = updatedBlog.blog.find(
                    (section) => section.section === "detailed_reviews"
                );
                if (detailedReviews) {
                    detailedReviews.content.splice(data.position, 0, {
                        appName: data.appName,
                        content: data.content,
                    });
                }
                break;

            case "remove_app":
                const detailedReviewsSection = updatedBlog.blog.find(
                    (section) => section.section === "detailed_reviews"
                );
                if (detailedReviewsSection) {
                    detailedReviewsSection.content.splice(data.position, 1);
                }
                break;

            case "update":
                _.set(updatedBlog, data.path, data.content);
                break;

             case "reorder":
                 const reorderTarget = updatedBlog.blog.find(
                    (section) => section.section === "detailed_reviews"
                ).content;
                 if (Array.isArray(reorderTarget)) {
                     const reorderedArray = [];

                     data.order.forEach((index) => {
                         if (index >= 0 && index < reorderTarget.length) {
                             reorderedArray.push(reorderTarget[index]);
                         } else {
                             console.error(`Invalid index ${index} in the order array.`);
                         }
                     });

                     reorderTarget.length = 0; 
                     reorderTarget.push(...reorderedArray); 
                 } else {
                     throw Error(`Path ${data.path} does not point to an array for reorder.`);
                 }
                 break;
            default:
                console.error(`Unsupported operation: ${type}`);
        }
    });

    return updatedBlog;
}
