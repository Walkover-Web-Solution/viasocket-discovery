function parseCookieHeader(header) {
    const out = {}
    if (!header) return out
    for (const part of header.split(';')) {
        const trimmed = part.trim()
        const eq = trimmed.indexOf('=')
        if (eq <= 0) continue
        const key = trimmed.slice(0, eq)
        const value = trimmed.slice(eq + 1)
        out[key] = value
    }
    return out
}

function readProxyAuthFromRequestCookies(req) {
    const env = process.env.NEXT_PUBLIC_NEXT_API_ENVIRONMENT || 'prod'
    const keys = [env, 'proxy_auth_token', 'proxy_auth']
    const cookies = parseCookieHeader(req.headers.cookie)
    for (const key of keys) {
        if (cookies[key]) {
            return cookies[key]
        }
    }
    return null
}

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method not allowed' })
    }

    const token = readProxyAuthFromRequestCookies(req)
    if (!token) {
        return res.status(200).json({
            success: true,
            data: { authenticated: false },
        })
    }

    return res.status(200).json({
        success: true,
        data: { authenticated: true, token },
    })
}