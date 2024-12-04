import { titleSuggestions } from '@/services/aiServices';

export default async function handler(req, res) {

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        let { search } = req.query;
        const titles = await titleSuggestions(search);
        res.status(200).json({ success: true, data: { titles } });
      } catch (error) {
         res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
