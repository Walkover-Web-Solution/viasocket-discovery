import { askAi, ValidateAiResponse, sendMessageTochannel } from "@/utils/utils";
import blogServices from "../../services/blogServices"
import { improveBlogSchema } from "@/utils/schema";


export default async function handler(req, res) {
    const { method } = req;
    const environment = req.headers['env'];
    switch (method) {
        case 'GET': 
            try {
                res.status(200).json({status:"success"})   // send immediate res 
                const blogs = await blogServices.getLastHourBlogs(environment);
                const bulkOperations = await Promise.all(blogs.map(async (blog) => {
                    try{
                    let aiResponse = await askAi(
                      process.env.IMPROVE_BRIDGE,
                      JSON.stringify({ blog : blog.blog })
                    );
                    const message_id = aiResponse.response.data.message_id;
                    aiResponse = JSON.parse(aiResponse.response.data.content);
                    const processedBlog = ValidateAiResponse( aiResponse, improveBlogSchema, process.env.IMPROVE_BRIDGE, message_id, true, "", false, true );
                    await distinctifyPhrase(processedBlog, environment);
                    return {
                        updateOne: {
                            filter: { id: blog.id },
                            update: { 
                              $set: { 
                                'blog': processedBlog.blog ,
                                'title' : processedBlog.blog.find(section => section.section === 'title').content,
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
                await blogServices.bulkUpdateBlogs(validBulkOperations, environment);
            } catch (error) {
                console.log("error in improve blogs", error)
                sendMessageTochannel({"message":'error in improve blog API.' , error : error.message})
             
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