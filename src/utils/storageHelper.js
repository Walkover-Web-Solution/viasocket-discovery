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
    expires = `; expires= ${date.toUTCString()}`
    document.cookie = `${key}=${value || ''}${expires}; domain=${domain}; path=/`
}

export const clearUserData = () => {
    removeCookie(getCurrentEnvironment());
    localStorage.clear();
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
    localStorage.setItem('path',fullPath);
  }
}

export const getRedirectPath = () => {
  if (typeof window !== "undefined") { 
    return  localStorage.getItem('path');
  }
  return null;
};

export const clearPath = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem('path');
  }
}