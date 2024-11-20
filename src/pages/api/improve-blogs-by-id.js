import { askAi, ValidateAiResponse, sendMessageTochannel, improveBlogPrompt, extractJsonFromMarkdown } from "@/utils/utils";
import blogServices from "../../services/blogServices"
import { improveBlogSchema } from "@/utils/schema";
import {  getRandomAuthorByCountryAndType, insertManyAuther } from "@/services/autherServices";


export default async function handler(req, res) {
    const { method } = req;
    const {id} = req.query;
    const environment = req.headers['env'];
    switch (method) {
        case 'GET':
            let results = []; 
            try {
                const blogs = [await blogServices.getBlogById(id,environment)];
                const bulkOperations = await Promise.all(blogs.map(async (blog) => {
                    try{
                    const auther = await getNames(blog.countryCode);
                    let aiResponse = await askAi(
                      process.env.IMPROVE_BRIDGE,
                      `${improveBlogPrompt( auther.writer.name, auther.philosopher.name , blog.countryCode )} ${JSON.stringify({blog : blog.blog , title : blog.title })}`
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
                    sendMessageTochannel({"message":'error in improve blog by ID askAi.' , error : err.message})
                    return null ;
                }
            }));
                const validBulkOperations = bulkOperations.filter(op => op !== null);            
                results = await blogServices.bulkUpdateBlogs(validBulkOperations, environment);
                return res.status(200).json({ success: true, message: "succesfully improved blog ", results: results });
                
            } catch (error) {
                console.log("error in improve blog by ID", error)
                sendMessageTochannel({"message":'error in improve blog by ID API.' , error : error.message})
             
            }finally{
                sendMessageTochannel({"message":'improveBlog by ID complete ' , results : results})
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

async function getNames (countryCode){
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
async function getWriter(countryCode,type){
    const res = await askAi(process.env.NEXT_PUBLIC_WRITER_GENERATOR_BRIGDE,`countryCode:${countryCode} and type:${type}`,{ countryCode : countryCode , profession : type });
    const names = JSON.parse(res.response.data.content).data;
    try {
        await insertManyAuther(names);
    } catch (error) {
        console.log(error)
    }
    return names[Math.floor(Math.random() * names.length)];
}