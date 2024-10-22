import blogServices from '@/services/blogServices';
import { searchTags } from '@/services/tagsServices';

export default async function handler(req, res) {

  const { method } = req;
  const profileHeader = req.headers['x-profile'];
  const environment = req.headers['env'];
  let user = null;
  if (profileHeader) {
    try {
      user = JSON.parse(profileHeader);
    } catch (error) {
      console.error('Error parsing profile from headers:', error);
    }
  }

  switch (method) {
    case 'GET':
      try {
        const { search } = req.query;
        let blogs;
        let tags ;
        if (search) {
          if (search.startsWith('#')) {
            blogs = await blogServices.searchBlogsByTag(search.slice(1),environment);
          } else {
            tags = (await searchTags(search))[0]?.matchingTags
            blogs = await blogServices.searchBlogsByQuery(search,environment);
          }
        } else blogs = await blogServices.getAllBlogs(user?.id || '',environment);
         res.status(200).json({ success: true, data: {blogs ,tags} });
      } catch (error) {
         res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const blog = await blogServices.createBlog({ ...req.body }, environment);
        res.status(201).json({ success: true, data: blog });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
