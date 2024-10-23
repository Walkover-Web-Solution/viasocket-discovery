import blogServices from '@/services/blogServices';

export default async function handler(req, res) {

  const { method } = req;
  const environment = req.headers['env'];
  switch (method) {

    case 'POST':
      const { tags, id } = req.body;
      try {
        const blogs = await blogServices.searchBlogsByTags( tags, id, environment );
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
