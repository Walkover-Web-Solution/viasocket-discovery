import blogServices from "@/services/blogServices";

import { sendMessageTochannel } from "@/utils/utils";

export default async function handler(req, res) {
    const { method } = req;
    const environment = req.headers['env'];
    switch (method) {
        case 'GET':
            let failedBlogs = [];  
            let successBlogs = [];
            try {
                res.status(200).json({status:"success"})   // send immediate res 
                const blogs = await blogServices.getAllBlogs(0,1000 ,{blog: 1 , id: 1 }, environment)

                const updatedBlogs = await Promise.allSettled(blogs.map(async (blog) => {
                   await syncBlogapps(blog, environment);
                }));

                updatedBlogs.forEach((result, index) => {
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
                console.error("error in syncing apps  ", error)
                sendMessageTochannel({"message":'error in syncing apps .' , error : error.message})
             
            }finally{
                sendMessageTochannel({"message":` sync apps complete ${successBlogs.length} blogs updated , ids:- ${successBlogs} ` , failedBlogs : failedBlogs})
            }
        default:
            // Handle unsupported request methods
            return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}

const syncBlogapps = async(blog, environment)=>{
  const data = await blogServices.syncBlogApps(blog.id, blog, environment);
  return data;
}