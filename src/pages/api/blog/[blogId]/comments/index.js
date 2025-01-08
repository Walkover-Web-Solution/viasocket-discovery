import blogServices from '@/services/blogServices';

export default async function handler(req, res) {
  const { method } = req;
  const { blogId } = req.query;
  const profileHeader = req.headers['x-profile'];
  const environment = req.headers['env'];
  let user = null;

  if (profileHeader) {
    user = JSON.parse(profileHeader);
  }

  switch (method) {
    case 'GET': 
      try {
        const comments = await blogServices.getAllComments(blogId, environment);
        res.status(200).json({ success: true, data: comments });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST': 
      try {
        const { text } = req.body;
        const commentData = {
          text,
          createdBy: parseInt(user.id),
          status: 'pending',
        };

        const newComment = await blogServices.createComment(blogId, commentData, environment);

        res.status(201).json({ success: true, data: { commentId: newComment.commentId } });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
