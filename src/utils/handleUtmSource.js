import { getDomain } from "./storageHelper";

export const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie?.split(";").map((cookie) => cookie.trim());
    for (const cookie of cookies) {
        const index = cookie.indexOf("=");
        const key = index === -1 ? cookie : cookie.slice(0, index);
        if (key === name) {
            return index === -1 ? "" : cookie.slice(index + 1);
        }
    }
    return null;
};

export const setCookie = (name, value, days = 1) => {
    if (typeof document === "undefined") return;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value || ""}; expires=${date.toUTCString()}; domain=${getDomain()}; path=/`;
};

export const setPromptInUtmData = (prompt) => {
    let utmData = {};
    const existing = getCookie("utmData");
    if (existing) {
        try {
            utmData = JSON.parse(existing);
        } catch {
            utmData = {};
        }
    }
    utmData.prompt = prompt || "";
    setCookie("utmData", JSON.stringify(utmData), 1);
};
