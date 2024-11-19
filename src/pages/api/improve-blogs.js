import { askAi, ValidateAiResponse, sendMessageTochannel, improveBlogPrompt, extractJsonFromMarkdown } from "@/utils/utils";
import blogServices from "../../services/blogServices"
import { improveBlogSchema } from "@/utils/schema";


export default async function handler(req, res) {
    const { method } = req;
    const environment = req.headers['env'];
    switch (method) {
        case 'GET':
            let results = []; 
            try {
                res.status(200).json({status:"success"})   // send immediate res 
                const blogs = await blogServices.getLastHourBlogs(environment);
                const bulkOperations = await Promise.all(blogs.map(async (blog) => {
                    try{
                    let aiResponse = await askAi(
                      process.env.IMPROVE_BRIDGE,
                      `${improveBlogPrompt( 'Charles Dickens', 'Immanuel Kant', 'Delhi', 'India' )} ${JSON.stringify({blog : blog.blog , title : blog.title })}`
                    );
                    const message_id = aiResponse.response.data.message_id;
                    aiResponse = extractJsonFromMarkdown(aiResponse.response.data.content);
                    const processedBlog = ValidateAiResponse(aiResponse, improveBlogSchema,process.env.IMPROVE_BRIDGE,message_id,true);
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
                }catch(err){
                    console.log(err,"error in ask ai ")
                    sendMessageTochannel({"message":'error in improve blog askAi.' , error : err.message})
                    return null ;
                }
            }));
                const validBulkOperations = bulkOperations.filter(op => op !== null);            
                results = await blogServices.bulkUpdateBlogs(validBulkOperations, environment);
            } catch (error) {
                console.log("error in improve blogs", error)
                sendMessageTochannel({"message":'error in improve blog API.' , error : error.message})
             
            }finally{
                sendMessageTochannel({"message":'improveBlog complete ' , results : results})
            }
        default:
            // Handle unsupported request methods
            return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}

async function distinctifyPhrase(processedBlog, environment) {
    if(processedBlog?.phrase){
        const existingBlogs = await blogServices.searchBlogsByQuery(processedBlog.phrase.content, environment);
        if(existingBlogs.length <= 5) return;
        console.log("Changing phrase Working...");
        const phraseSection = processedBlog.blog.find(section => section.section === processedBlog.phrase.section);
        const response = await askAi(process.env.DISTINCTIFY_PHRASE_BRIDGE, phraseSection.content, {phrase: processedBlog.phrase.content})
        phraseSection.content = response.response.data.content;
    }
}