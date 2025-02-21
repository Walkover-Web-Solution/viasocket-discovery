import {  sendMessageTochannel } from "@/utils/utils";
import blogServices from "../../../services/blogServices"
import { createBulkOperation } from "../improve-blogs";


export default async function handler(req, res) {
    const { method } = req;
    const {id} = req.query;
    const environment = req.headers['env'];
    switch (method) {
        case 'POST':
            let results = []; 
            try {
                const blogs = [await blogServices.getBlogById(id,environment)];
                const bulkOperations = await createBulkOperation(blogs,environment);
                if(bulkOperations[0].status === "rejected"){
                    throw new Error(bulkOperations[0].reason)
                }
                const validBulkOperations = [bulkOperations[0].value];            
                results = await blogServices.bulkUpdateBlogs(validBulkOperations, environment);
                return res.status(200).json({ success: true, message: `succesfully improved the blog ${id}`});
                
            } catch (error) {
                console.error("error in improve blog by ID", error)
                sendMessageTochannel({"message":'error in improve blog by ID API.' , error : error.message})
                res.status(400).json({ success: false, error: error.message });
             
            }finally{
                sendMessageTochannel({"message":`improveBlog by ID complete ${id}`})
            }
        default:
            // Handle unsupported request methods
            return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}


