import blogServices from '@/services/blogServices';

export default async function handler(req, res) {
  const { method } = req;
  const { blogId, commentId } = req.query;
  const profileHeader = req.headers['x-profile'];
  const environment = req.headers['env'];
  let user = null;

  if (profileHeader) {
    user = JSON.parse(profileHeader);
  }
  const userId  = (user?.id) ? parseInt(user?.id) : null;

  switch (method) {
   
    case 'GET':
      try {
        const comment = await blogServices.getCommentById(blogId, commentId, environment);
        res.status(200).json({ success: true, data: comment });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        const { text, status } = req.body;
        const commentData = { text, status };
        const updatedComment = await blogServices.updateComment(blogId, commentId, commentData, environment);
        res.status(200).json({ success: true, data: updatedComment });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        await blogServices.deleteComment(blogId, commentId, userId, environment);
        res.status(200).json({ success: true, message: 'Comment deleted successfully' });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
