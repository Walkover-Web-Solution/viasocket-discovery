// /utils/apiHelper.js
import { getCurrentEnvironment, getFromCookies, removeCookie, clearUserData } from "@/utils/storageHelper";
import { toast } from "react-toastify";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const proxyBaseURL = "https://routes.msg91.com/api"; 

export const getCurrentUser = async () => {
    const endpoint = "/c/getDetails"; 

    const getToken = () => {
        const env = getCurrentEnvironment();
        return (env === 'local') ? localStorage.getItem("proxy_auth_token") : getFromCookies(env);
    };

    try {
        const token = getToken();
        const headers = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers["proxy_auth_token"] = token;
        }

        const response = await fetch(proxyBaseURL + endpoint, {
            method: 'GET',
            headers: headers,
        });

        if (response.status === 401) {
            toast.error('Session Expired');
            removeCookie(getCurrentEnvironment());
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json();
            toast.error(errorData.message);
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching current user details:", error);
    }
};


const getHeaders = () => {
  const env = getCurrentEnvironment();
  const token = getFromCookies(env);
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    const headerKey = env === 'local' ? 'Authorization' : 'proxy_auth_token';
    headers[headerKey] = token;
    headers['token'] = localStorage.getItem('proxy_auth_token');
  }
  
  return headers;
};


export const signUpOnBE = async (data) => {
  const response = await fetch(baseUrl+`/api/users`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  const res = await response.json();
  if (res.success) return res;
  if (res.status === 401) {
    toast.error('Session Expired');
    clearUserData();
  } else{
    toast.error(res?.message || 'An error occurred');
  }
};


export const fetchIntegrations = async (pluginNames) => {
  try {
    const response = await fetch(baseUrl+`/api/integrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'env' : getCurrentEnvironment()
      },
      body: JSON.stringify({ pluginNames: pluginNames })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch integrations: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data?.data;
  } catch (error) {
    console.error('Error fetching integrations:', error);
  }
};

export const titleSuggestions =  async(userQuery, existingTitles) => {
  try{
    const response = await fetch(baseUrl+`/api/suggestions?search=${userQuery}`, {
      method: 'POST',
      body: JSON.stringify({ existingTitles }),
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch suggestions: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data.titles;
  } catch(error){
    console.log("error getting title suggestions ", error);
    return [];
  }
}
