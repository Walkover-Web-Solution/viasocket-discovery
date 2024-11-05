import { askAi, ValidateAiResponse, dispatchAskAiEvent } from "@/utils/utils";
import blogServices from "../../services/blogServices"
import { improveBlogSchema } from "@/utils/schema";


export default async function handler(req, res) {
    const { method } = req;
    const environment = req.headers['env'];
    switch (method) {
        case 'GET': 
            try {
                const blogs = await blogServices.getLastHourBlogs(environment);
                const bulkOperations = await Promise.all(blogs.map(async (blog) => {
                    try{
                    let aiResponse = await askAi(
                      process.env.IMPROVE_BRIDGE,
                      JSON.stringify({ blog : blog.blog , tags: blog.tags })
                    );
                    aiResponse = JSON.parse(aiResponse.response.data.content);
                    const processedBlog = ValidateAiResponse(aiResponse, improveBlogSchema);
                    await distinctifyPhrase(processedBlog, environment);
                    return {
                        updateOne: {
                            filter: { id: blog.id },
                            update: { 
                              $set: { 
                                'blog': processedBlog.blog ,
                                'title' : processedBlog.blog.find(section => section.section === 'title').content,
                                'tags' : processedBlog.tags
                              }
                            }
                        }
                    };
                }catch(err){
                    console.log(err,"error in ask ai ")
                    return null ;
                }
            }));
                const validBulkOperations = bulkOperations.filter(op => op !== null);            
                const result = await blogServices.bulkUpdateBlogs(validBulkOperations, environment);
                return res.status(200).json({status:"success", data : result })
            } catch (error) {
                console.log("error in improve blogs", error)
                return res.status(400).json({status:"failed", messege:"failed to improve last hour created blog " })
             
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