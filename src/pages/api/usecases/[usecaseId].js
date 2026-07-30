import { getUsecaseById } from '@/services/usecaseServices';

export default async function handler(req, res) {
  const { method } = req;
  const { usecaseId } = req.query;
  const environment = req.headers['env'];

  switch (method) {
    case 'GET':
      try {
        const usecase = await getUsecaseById(usecaseId, environment);
        if (!usecase) {
          return res.status(404).json({ success: false, error: 'Usecase not found' });
        }
        res.status(200).json({ success: true, data: usecase });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
