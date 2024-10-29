import { askAi } from "@/utils/utils";
import blogServices from "../../services/blogServices"


export default async function handler(req, res) {
    const { method } = req;
    const environment = req.headers['env'];
    switch (method) {
        case 'GET': 
            try {
                const blogs = await blogServices.getLastHourBlogs(environment);
                const bulkOperations = await Promise.all(blogs.map(async (blog) => {
                    try{
                    let processedBlog = await askAi(process.env.IMPROVE_BRIDGE,JSON.stringify({blog:blog.blog}),{},`${Date.now()}`);
                    processedBlog = JSON.parse(processedBlog.response.data.content);
                    return {
                        updateOne: {
                            filter: { id: blog.id },
                            update: { $set: { 'blog': processedBlog.blog } }
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