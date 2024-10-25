import blogServices from '@/services/blogServices';

export default async function handler(req, res) {

  const { method } = req;
  const environment = req.headers['env'];
  switch (method) {

    case 'GET':
      const { blogId } = req.query;
      try {
        const blog = await blogServices.getBlogById( blogId , environment );
        const blogs = await blogServices.searchBlogsByTags( blog.tags, blogId, blog.meta?.category, environment );
        res.status(201).json({ success: true, data: blogs });
      } catch (error) {
        console.log("error getting releted blogs", error)
        res.status(400).json({ success: false, error: error.stack });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
