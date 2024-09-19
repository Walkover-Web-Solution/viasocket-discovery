import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { email, id } = req.body;
            const token = jwt.sign(
                {
                    user: {
                        email,
                        id: id?.toString(),
                    },
                    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                },
                process.env.TOKEN_SECRET_KEY,
                { expiresIn: '48h' },
            );

            return res.status(201).json(
                {
                    success: true,
                    message: "User created",
                    data: token,
                }
            );
        } catch (error) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Failed to create user",
                    data: error?.message || ""
                }
            );
        }
    } else {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
