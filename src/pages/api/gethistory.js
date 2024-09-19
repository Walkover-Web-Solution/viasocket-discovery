
import fetch from "node-fetch";
export default async function handler(req, res) {
    if (req.method === 'GET') {
      const { chatId } = req.query; 
      try {
        const externalResponse = await fetch(
          `https://routes.msg91.com/api/proxy/1258584/32nghul25/api/v1/config/threads/${chatId}/${process.env.BRIDGE_ID}`,
          {
            method: 'GET',
            headers: {
              pauthkey: process.env.PAUTH_KEY,  
              'Content-Type': 'application/json',
            },
          }
        );
  
        if (!externalResponse.ok) {
          throw new Error(`Error fetching chat history: ${externalResponse.statusText}`);
        }
        const data = await externalResponse.json();
        return res.status(200).json({ success: true, data: data });
      } catch (error) {
        return res.status(500).json({ message: 'Error fetching chat history', error: error.message });
      }
    } else {
      // Handle other HTTP methods
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} not allowed`);
    }
  }
  