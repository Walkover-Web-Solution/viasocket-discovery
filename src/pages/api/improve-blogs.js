import { askAi, ValidateAiResponse, sendMessageTochannel, sendAlert, improveBlogPrompt, extractJsonFromMarkdown } from "@/utils/utils";
import blogServices from "../../services/blogServices"
import { improveBlogSchema } from "@/utils/schema";
import {  getRandomAuthorByCountryAndType, insertManyAuther } from "@/services/autherServices";


export default async function handler(req, res) {
    const { method } = req;
    const environment = req.headers['env'];
    switch (method) {
        case 'POST':
            let results = {}; 
            let failedBlogs = [];  
            try {
                res.status(200).json({status:"success"})   // send immediate res 
                const blogs = await blogServices.getBlogsForImprove(environment);
                const bulkOperations =await createBulkOperation(blogs,environment);
                let validBulkOperations = [];
                bulkOperations.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        validBulkOperations.push(result.value);
                    } else if (result.status === 'rejected') {
                        failedBlogs.push({
                            id: blogs[index].id,
                            reason: result.reason.message
                        });
                    }
                });
                
                results = await blogServices.bulkUpdateBlogs(validBulkOperations, environment);
            } catch (error) {
                console.log("error in improve blogs", error)
                sendMessageTochannel({"message":'error in improve blog API.' , error : error.message})
             
            }finally{
                sendMessageTochannel({"message":`improveBlog complete ${results?.result?.nModified} blogs updated ` , failedBlogs : failedBlogs})
            }
        default:
            // Handle unsupported request methods
            return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}

export async function distinctifyPhrase(processedBlog, environment) {
    if(processedBlog?.phrase){
        const existingBlogs = await blogServices.searchBlogsByQuery(processedBlog.phrase.content, environment);
        if(existingBlogs.length <= 5) return;
        console.log("Changing phrase Working...");
        const phraseSection = processedBlog.blog.find(section => section.section === processedBlog.phrase.section);
        const response = await askAi(process.env.DISTINCTIFY_PHRASE_BRIDGE, phraseSection.content, {phrase: processedBlog.phrase.content})
        phraseSection.content = response.response.data.content;
    }
}

export async function getNames (countryCode){
    let [writer, philosopher] = await Promise.all([
        getRandomAuthorByCountryAndType(countryCode, 'writer'),
        getRandomAuthorByCountryAndType(countryCode, 'philosopher')
    ]);

    if(!writer){
        writer = await getWriter(countryCode,'writer');
    }
    if(!philosopher){
        philosopher =await getWriter(countryCode,'philosopher');
    }
    return { writer , philosopher }
}
export async function getWriter(countryCode,type){
    const res = await askAi(process.env.NEXT_PUBLIC_WRITER_GENERATOR_BRIGDE,`countryCode:${countryCode} and type:${type}`,{ countryCode : countryCode , profession : type });
    const names = JSON.parse(res.response.data.content).data;
    await insertManyAuther(names);
    return names[Math.floor(Math.random() * names.length)];
}


export async function createBulkOperation (blogs,environment){
   return await Promise.allSettled(blogs.map(async (blog) => {

        const countryCode = blog.countryCode || 'IN'; 
        const auther = await getNames(countryCode);
        let aiResponse = await askAi(
          process.env.IMPROVE_BRIDGE,
          `${improveBlogPrompt( auther.writer.name, auther.philosopher.name , countryCode )} ${JSON.stringify({blog : blog.blog , title : blog.title })}`
        );
        const message_id = aiResponse.response.data.message_id;
        aiResponse = extractJsonFromMarkdown(aiResponse.response.data.content);
        let processedBlog = ValidateAiResponse(aiResponse, improveBlogSchema,process.env.IMPROVE_BRIDGE,message_id,true);
        if(processedBlog.success===true){
            processedBlog = processedBlog.value;
        } else {
            sendAlert(processedBlog.errorMessages, process.env.IMPROVE_BRIDGE, message_id, "" );
            processedBlog = { message : processedBlog.message || "" }
        }
        await distinctifyPhrase(processedBlog, environment);
        return {
            updateOne: {
                filter: { id: blog.id },
                update: { 
                  $set: { 
                    'blog': processedBlog.blog ,
                    'title' : processedBlog.title,
                  }
                }
            }
        };
}));
}