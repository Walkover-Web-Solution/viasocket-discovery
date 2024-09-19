import axios from "axios";
import { getCurrentEnvironment, getFromCookies, removeCookie } from "./storageHelper";

axios.interceptors.request.use(
    async (config) => {
        const token = getFromCookies(getCurrentEnvironment())
        config.headers['proxy_auth_token'] = token;
        if (process.env.NEXT_PUBLIC_ENV === 'local')
            config.headers['Authorization'] = token
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async function (error) {
        if (error?.response?.status === 401) {
            removeCookie(getCurrentEnvironment())
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default axios;
