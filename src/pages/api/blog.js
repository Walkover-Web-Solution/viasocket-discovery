import blogServices from '@/services/blogServices';

export default async function handler(req, res) {

  const { method } = req;
  const profileHeader = req.headers['x-profile'];
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
        const { search, tag } = req.query; 
        if (search) {
          const blogs = await blogServices.searchBlogsByQuery(search);
          return res.status(200).json({ success: true, data: blogs });
        }
        if(tag){
          const blogs = await blogServices.searchBlogsByTag(tag);
          return res.status(200).json({ success: true, data: blogs });
        }
        const [userBlogs, otherBlogs] = await Promise.all([
          blogServices.getUserBlogs(user?.id || ''),
          blogServices.getOtherBlogs(user?.id || '')
        ]);
        res.status(200).json({ success: true, data: { userBlogs, otherBlogs } });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const blog = await blogServices.createBlog({ ...req.body });
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
