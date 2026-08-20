import { getRecentUsecases } from '@/services/usecaseServices';

export default async function handler(req, res) {
  const { method } = req;
  const environment = req.headers['env'];

  switch (method) {
    case 'GET':
      try {
        const { page, limit } = req.query;
        const result = await getRecentUsecases({ page, limit, environment });
        res.status(200).json({ success: true, data: result });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
