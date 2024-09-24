
import dbConnect from '../../../../lib/mongoDb'; // A utility to connect to MongoDB
import blogServices from '@/services/blogServices';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'PATCH':
      try {
        const { blogId } = req.query;
        const updatedBlog = await blogServices.updateBlogById(blogId, req.body);
        if (!updatedBlog) {
          return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.status(200).json({ success: true, data: updatedBlog });
      } catch (error) {
      res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
