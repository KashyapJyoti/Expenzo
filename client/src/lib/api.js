import axios from "axios";
import { format } from "../utils/logger.js";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem("expenzo_auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch {
        // ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized, redirecting to login");
    }
    format(error);
    return Promise.reject(error);
  }
);

