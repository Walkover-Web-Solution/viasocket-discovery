// pages/api/compare-blogs.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Only POST requests are allowed' });
    }
  
    const { variables } = req.body;
  
    try {
      const response = await fetch(
        'https://routes.msg91.com/api/proxy/1258584/29gjrmh24/api/v2/model/chat/completion',
        {
          method: 'POST',
          headers: {
            'pauthkey': process.env.PAUTH_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: "compare",
            bridge_id: process.env.BRIDGE_ID_FOR_COMPARE,
            variables: variables,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to compare blogs: ${response.statusText}`);
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error comparing blogs:', error);
      res.status(500).json({ message: 'Error comparing blogs', error: error.message });
    }
  }
  