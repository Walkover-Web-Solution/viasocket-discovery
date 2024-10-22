import { askAi } from '@/utils/utils';
import fetch from 'node-fetch';

export const config = {
  maxDuration: 30,
};

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'POST': 
            try {
                const { userMessage, chatId, bridgeId, variables } = req.body;

                const data = await askAi(bridgeId, userMessage, {...variables, user_id : JSON.parse(req.headers['x-profile']).id , env : process.env.NEXT_PUBLIC_NEXT_API_ENVIRONMENT}, chatId)
                // Return the response data to the client
                return res.status(200).json({ success: true, data: data });
            } catch (error) {
                // Return error response
                console.error("error in chatBot api ",error)
                return res.status(400).json({ success: false, error: error.message });
            }
        default:
            // Handle unsupported request methods
            return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
