import blogServices from '@/services/blogServices';
import { searchTags } from '@/services/tagsServices';
import { createBlog } from './ask-ai';
import { sendMessageTochannel, SendNewBlogTODbDash } from '@/utils/utils';

export default async function handler(req, res) {
  const { method } = req;
  const profileHeader = req.headers['x-profile'];
  const environment = req.headers['env'];
  let user = null;
  if (profileHeader) {
      user = JSON.parse(profileHeader);
  }

  switch (method) {
    case 'POST':
      try {
        const blogs = await blogServices.getAllBlogs(0,1000,{__v:0},'prod');
        console.log(blogs.length)
        blogs.forEach(async (newBlog) => {
         await SendNewBlogTODbDash(newBlog,'prod')
        });
        
        res.status(201).json({ success: true });
      } catch (error) {
        console.error("error syncing blogs in db dash ",error);
        sendMessageTochannel({message:"error syncing blogs in db dash", error:error.message})
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
