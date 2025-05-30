import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          first_name: string;
          hash: string;
          start_param?: string;
          user: {
            id: number;
          };
        };
        [key: string]: any;
      };
    };
  }
}

export function getWebAppData(isUnsafe = false): any {
  if (import.meta.env.VITE_INIT_DATA) {
    // return Object.fromEntries(new URLSearchParams(import.meta.env.VITE_INIT_DATA));
    return import.meta.env.VITE_INIT_DATA;
  }

  if (isUnsafe) {
    return window.Telegram.WebApp.initDataUnsafe;
  } else {
    try {
      return window.Telegram.WebApp.initData;
    } catch {
      return null;
    }
  }
}

api.interceptors.request.use(
  (config) => {
    try {
      const webAppData = getWebAppData();

      if (webAppData) {
        // const xHash = JSON.stringify(webAppData);

        // const xHashUtf8 = utf8.encode(xHash);
        // const xHashBase64 = base64.encode(xHashUtf8);

        config.headers["init_data"] = webAppData;
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

export default api;
