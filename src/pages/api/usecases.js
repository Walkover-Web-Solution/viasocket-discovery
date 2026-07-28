import { suggestAppUsecases, getUsecases } from '@/services/usecaseServices';

export default async function handler(req, res) {
  const { method } = req;
  const profileHeader = req.headers['x-profile'];
  const environment = req.headers['env'];
  const user = profileHeader ? JSON.parse(profileHeader) : null;

  switch (method) {
    case 'GET':
      try {
        // three combinable filters: ?userId=, ?app=, ?recent=true (default sort/limit)
        const { userId, app, limit } = req.query;
        const data = await getUsecases({ userId, app, limit, environment });
        res.status(200).json({ success: true, data });
      } catch (error) {
        console.error('Error in GET /api/usecases:', error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const { apps, message } = req.body || {};
        if (!Array.isArray(apps) || !apps.filter(Boolean).length) {
          return res.status(400).json({ success: false, error: 'apps must be a non-empty array' });
        }
        const data = await suggestAppUsecases(apps, message, {
          userId: user?.id ? parseInt(user.id) : null,
          environment,
        });
        res.status(200).json({ success: true, data });
      } catch (error) {
        console.error('Error in /api/usecases:', error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
