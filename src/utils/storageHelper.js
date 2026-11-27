function getDomain() {
    const hostname = window.location.hostname;
    const parts = hostname?.split('.');
    
    if (parts.length >= 3 && parts[parts.length - 1] === 'app') {
        // Handle cases where the domain is like app-discovery-weld.vercel.app
        return `.${parts.slice(-3).join('.')}`; // returns ".vercel.app"
    } else if (parts.length >= 2) {
        // For domains like example.com
        return `.${parts.slice(-2).join('.')}`; 
    }
    
    return hostname;
}
export const getCurrentEnvironment = () => process.env.NEXT_PUBLIC_NEXT_API_ENVIRONMENT

export const PROXY_AUTH_KEY = 'proxy_auth_token'

/** Query keys viasocket / MSG91 may use on the auth callback URL. */
export const PROXY_AUTH_QUERY_KEYS = [PROXY_AUTH_KEY, 'proxy_auth']

/** Cookie names that may hold the proxy token on viasocket.com (env key is canonical after sync). */
export function getProxyAuthCookieKeys() {
    const env = getCurrentEnvironment()
    return [env, PROXY_AUTH_KEY, 'proxy_auth']
}

function readProxyAuthFromSearchParams(params) {
    for (const key of PROXY_AUTH_QUERY_KEYS) {
        const value = params.get(key)
        if (value) return value
    }
    return null
}

function readProxyAuthFromDocumentCookies() {
    for (const key of getProxyAuthCookieKeys()) {
        const value = getFromCookies(key)
        if (value) return { key, value }
    }
    return null
}

/** Copy a token from any known cookie name into localStorage and the env cookie. */
export const syncProxyAuthTokenFromCookies = () => {
    if (typeof window === 'undefined') return null
    const fromCookie = readProxyAuthFromDocumentCookies()
    if (!fromCookie) return null
    localStorage.setItem(PROXY_AUTH_KEY, fromCookie.value)
    const envKey = getCurrentEnvironment()
    if (fromCookie.key !== envKey) {
        setInCookies(envKey, fromCookie.value)
    }
    return fromCookie.value
}

let bootstrapSessionPromise = null

/** Load token from readable cookies, else ask the server (HttpOnly cookies). */
export async function bootstrapProxyAuthSession() {
    if (typeof window === 'undefined') return null
    const fromClient = syncProxyAuthTokenFromCookies() || localStorage.getItem(PROXY_AUTH_KEY)
    if (fromClient) return fromClient

    if (!bootstrapSessionPromise) {
        bootstrapSessionPromise = (async () => {
            try {
                const base = process.env.NEXT_PUBLIC_API_URL || ''
                const res = await fetch(`${base}/api/auth/session`, { credentials: 'include' })
                if (!res.ok) return null
                const json = await res.json()
                const token = json?.data?.token
                if (!token) return null
                localStorage.setItem(PROXY_AUTH_KEY, token)
                setInCookies(getCurrentEnvironment(), token)
                return token
            } catch (error) {
                console.error('bootstrapProxyAuthSession failed', error)
                return null
            } finally {
                bootstrapSessionPromise = null
            }
        })()
    }
    return bootstrapSessionPromise
}

/** Token from env or proxy_auth* cookies, localStorage, with cross-store fallback. */
export const getProxyAuthToken = () => {
    if (typeof window === 'undefined') return null
    const fromCookie = syncProxyAuthTokenFromCookies()
    if (fromCookie) return fromCookie
    const fromLs = localStorage.getItem(PROXY_AUTH_KEY)
    if (fromLs) return fromLs
    return null
}

/** Read `proxy_auth_token` or `proxy_auth` from the query string and persist for API calls. */
export const persistProxyAuthTokenFromSearch = (search) => {
    if (typeof window === 'undefined') return null
    const query = search ?? window.location.search
    if (!query) return null
    const params = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query)
    const token = readProxyAuthFromSearchParams(params)
    if (!token) return null
    localStorage.setItem(PROXY_AUTH_KEY, token)
    setInCookies(getCurrentEnvironment(), token)
    return token
}

export const getFromCookies = (cookieId) => {
    // Split cookies string into individual cookie pairs and trim whitespace
    const cookies = document.cookie?.split(';').map((cookie) => cookie.trim())
    // Loop through each cookie pair
    for (let i = 0; i < cookies.length; i++) {
        // const cookiePair = cookies[i]?.split('=');
        // If cookie name matches, return its value
        const [key, value] = splitFromFirstEqual(cookies[i])
        if (cookieId === key) {
            return value
        }
    }
    // If the cookie with the given name doesn't exist, return null
    return null
}
export const removeCookie = (cookieName) => {
    const domain = getDomain()
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`
}

function splitFromFirstEqual(str) {
    // Handle empty string or string without an equal sign gracefully
    if (!str || str.indexOf('=') === -1) {
        return [str, ''] // Return the original string as both parts
    }

    // Find the index of the first equal sign
    const index = str.indexOf('=')

    // Handle cases where the equal sign is at the beginning or end of the string
    if (index === 0) {
        return ['', str.slice(1)] // Empty key, value is the rest of the string
    }
    if (index === str.length - 1) {
        return [str.slice(0, -1), ''] // Key is the entire string except the last character (equal sign)
    }

    // Split the string into key and value parts
    const key = str.slice(0, index)
    const value = str.slice(index + 1)

    return [key, value]
}

export const setInCookies = (key, value) => {
    const domain = getDomain()
    let expires = ''

    const date = new Date()
    date.setTime(date.getTime() + 2 * 24 * 60 * 60 * 1000)
    expires = `; expires=${date.toUTCString()}`
    document.cookie = `${key}=${value || ''}${expires}; domain=${domain}; path=/`
}

export const clearUserData = () => {
    for (const key of getProxyAuthCookieKeys()) {
        removeCookie(key)
    }
    localStorage.removeItem(PROXY_AUTH_KEY)
    localStorage.removeItem('loginRedirectionPath')
}
export const getUserDataFromLocalStorage = () => {
    if (typeof window !== "undefined") { // Ensure this runs only on the client side
      const userData = localStorage.getItem('userDetail');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  };

export const setPathInLocalStorage = () => {
  if (typeof window !== "undefined") { 
    const fullPath = window.location.pathname + window.location.search;
    localStorage.setItem('loginRedirectionPath',fullPath);
  }
}
export const setInLocalStorage = ( key, value ) => {
  if (typeof window !== "undefined") { 
    localStorage.setItem( `${key}`, value );
  }
}
export const getFromLocalStorage = ( key , removeKey ) => {
  if (typeof window !== "undefined") { 
    const value = localStorage.getItem(`${key}`);
    if(removeKey) localStorage.removeItem(`${key}`);
    return value;
  }
}

export const getRedirectPath = () => {
  if (typeof window !== "undefined") { 
    return  localStorage.getItem('loginRedirectionPath');
  }
  return null;
};

export const clearPath = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem('loginRedirectionPath');
  }
}