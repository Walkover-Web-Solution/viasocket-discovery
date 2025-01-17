import blogServices from "@/services/blogServices";
import { sendMessageTochannel } from "@/utils/utils";
import { updateBlogUsingComments } from "./blog/[blogId]/update-blog";

export default async function handler(req, res) {
    const { method } = req;
    const environment = req.headers['env'];
    switch (method) {
        case 'POST':
            let failedBlogs = [];  
            let successBlogs = [];
            try {
                res.status(200).json({status:"success"})   // send immediate res 
                const blogs = await blogServices.getBlogsToMergeComments(environment);

                const commentsResults = await Promise.allSettled(blogs.map(async (blog) => {
                 await updateBlogUsingComments(blog.id, environment);
                }));

                commentsResults.forEach((result, index) => {
                  if (result.status === 'fulfilled') {
                    successBlogs.push(blogs[index].id);
                  } else {
                    failedBlogs.push({
                      id: blogs[index].id,
                      reason: result.reason.message
                    });
                  }
              });

            } catch (error) {
                console.error("error in update blogs of blogs ", error)
                sendMessageTochannel({"message":'error in update blogs .' , error : error.message})
             
            }finally{
                sendMessageTochannel({"message":`update blogs complete ${successBlogs.length} blogs updated , ids:- ${successBlogs} ` , failedBlogs : failedBlogs})
            }
        default:
            // Handle unsupported request methods
            return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}