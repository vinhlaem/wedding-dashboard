import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT to every request when available
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear local auth state and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      import("./auth").then(({ removeToken }) => {
        removeToken();
        window.location.href = "/login";
      });
    }
    return Promise.reject(error);
  },
);

export default api;
