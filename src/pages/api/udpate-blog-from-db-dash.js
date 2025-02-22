import blogServices from '@/services/blogServices';
import { sendMessageTochannel } from '@/utils/utils';

export default async function handler(req, res) {
  const { method } = req;
  const environment = req.headers['env'];

  switch (method) {
    case 'PATCH':
      try {
        const { blogToUpdate, updatedFields } = req.body;
        if (!blogToUpdate || !blogToUpdate.id) {
          return res.status(400).json({ success: false, error: "Invalid blog data" });
        }
        const excludeFields = ['id','apps','created_at','updated_at','appnames','mongoid'];
        const oldBlog = await blogServices.getBlogById(blogToUpdate.id,environment);
        updatedFields.forEach((key) => {
          if(!excludeFields.includes(key)){
            oldBlog[key] = blogToUpdate[key];
          }
        });
        await blogServices.directUpdateBlog(blogToUpdate.id,oldBlog,environment);

        res.status(200).json({ success: true });
      } catch (error) {
        console.error("error updating blog from Db DASH",error);
        sendMessageTochannel({message:"error updating blog from Db DASH", error:error.message})
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
