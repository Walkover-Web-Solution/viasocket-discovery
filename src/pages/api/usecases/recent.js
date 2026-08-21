import { getRecentUsecases } from '@/services/usecaseServices';
import { getAllUsers } from '@/utils/utils';

// the cards carry a byline, and only the server can talk to the proxy user
// service — resolve every author in one batch and send the names along
async function attachAuthors(usecases) {
  const userIds = [...new Set(usecases.map((usecase) => usecase.createdBy).filter((id) => id != null))];
  if (!userIds.length) return usecases;

  const users = await getAllUsers(userIds);
  const nameById = {};
  userIds.forEach((id, index) => {
    const name = users?.[index]?.name;
    if (name) nameById[id] = name;
  });

  return usecases.map((usecase) => ({
    ...usecase,
    author: nameById[usecase.createdBy] || null,
  }));
}

export default async function handler(req, res) {
  const { method } = req;
  const environment = req.headers['env'];

  switch (method) {
    case 'GET':
      try {
        const { page, limit } = req.query;
        const result = await getRecentUsecases({ page, limit, environment });
        result.usecases = await attachAuthors(result.usecases || []);
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
