import blogServices from '@/services/blogServices';

export default async function handler(req, res) {

  const { method, query } = req;
  
  switch (method) {
    case 'GET':
      try {
        const { user, userId } = query;
        let blogs;
        if (user === 'true') {
          blogs = await blogServices.getUserBlogs(userId);
        } else if (user === 'false') {
          blogs = await blogServices.getOtherBlogs(userId);
        } else {
          blogs = await blogServices.getAllBlogs();
        }
        res.status(200).json({ success: true, data: blogs });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;

    case 'POST':
      try {
        const blog = await blogServices.createBlog(req.body);
        res.status(201).json({ success: true, data: blog });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
