import fetch from 'node-fetch';


export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'POST': 
            try {
                const { userMessage, chatId, bridgeId, variables } = req.body;

                // Ensure you're using server-side environment variables (without NEXT_PUBLIC)
                const PAUTH_KEY = process.env.PAUTH_KEY;
                // const BRIDGE_ID = process.env.BRIDGE_ID;

                const response = await fetch(
                    'https://routes.msg91.com/api/proxy/1258584/29gjrmh24/api/v2/model/chat/completion',
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'pauthkey': PAUTH_KEY,
                      },
                      body: JSON.stringify({
                        user: userMessage,
                        bridge_id: bridgeId,
                        thread_id: chatId + "",
                        variables: {...variables, user_id : JSON.parse(req.headers['x-profile']).id}
                      }),
                    }
                  );
                  const data = await response.json()
          
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
