import { getIntegrations } from "@/services/integrationServices";
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { pluginNames } = req.body;
        try {
            const data = await getIntegrations(pluginNames)
            return res.status(200).json({ success: true, data: data });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching integrations', error: error.message });
        }
    } else {
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}
