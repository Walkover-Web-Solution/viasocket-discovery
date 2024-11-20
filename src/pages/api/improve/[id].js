import {  sendMessageTochannel } from "@/utils/utils";
import blogServices from "../../../services/blogServices"
import { createBulkOperation } from "../improve-blogs";


export default async function handler(req, res) {
    const { method } = req;
    const {id} = req.query;
    const environment = req.headers['env'];
    switch (method) {
        case 'GET':
            let results = []; 
            try {
                const blogs = [await blogServices.getBlogById(id,environment)];
                const bulkOperations = await createBulkOperation(blogs,environment);
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


