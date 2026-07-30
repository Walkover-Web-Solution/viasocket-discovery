import { createComment, getAllComments } from '@/services/usecaseServices';

export default async function handler(req, res) {
  const { method } = req;
  const { usecaseId } = req.query;
  const profileHeader = req.headers['x-profile'];
  const environment = req.headers['env'];
  let user = null;

  if (profileHeader) {
    user = JSON.parse(profileHeader);
  }

  switch (method) {
    case 'GET':
      try {
        const comments = await getAllComments(usecaseId, environment);
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

        const newComment = await createComment(usecaseId, commentData, environment);
        res.status(201).json({ success: true, data: { comment: newComment } });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
