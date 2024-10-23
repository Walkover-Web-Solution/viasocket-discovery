import axios from "axios";
import { getCurrentEnvironment, getFromCookies, removeCookie } from "./storageHelper";

axios.interceptors.request.use(
    async (config) => {
        const token = getFromCookies(getCurrentEnvironment())
        config.headers['proxy_auth_token'] = token;
        config.headers['env'] = getCurrentEnvironment();
        if (getCurrentEnvironment() === 'local')
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
            window.location.href = "/discovery";
        }
        return Promise.reject(error);
    }
);

export default axios;
