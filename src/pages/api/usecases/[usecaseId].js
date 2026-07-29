import { updateUsecaseWithRequest } from '@/services/usecaseServices';

export default async function handler(req, res) {
  const { method } = req;
  const { usecaseId } = req.query;
  const profileHeader = req.headers['x-profile'];
  const environment = req.headers['env'];
  const user = profileHeader ? JSON.parse(profileHeader) : null;

  switch (method) {
    case 'PATCH':
      try {
        const { message } = req.body || {};
        if (!message?.trim()) {
          return res.status(400).json({ success: false, error: 'message is required' });
        }
        const data = await updateUsecaseWithRequest(usecaseId, message, {
          userId: user?.id ? parseInt(user.id) : null,
          environment,
        });
        res.status(200).json({ success: true, data });
      } catch (error) {
        console.error('Error in PATCH /api/usecases/[usecaseId]:', error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
