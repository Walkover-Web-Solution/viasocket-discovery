import blogServices from '@/services/blogServices';

export default async function handler(req, res) {

  const { method } = req;

  switch (method) {

    case 'POST':
      const { tags, id } = req.body;
      try {
        const blogs = await blogServices.searchBlogsByTags( tags, id );
        res.status(201).json({ success: true, data: blogs });
      } catch (error) {
        console.log("error getting releted blogs", error)
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
