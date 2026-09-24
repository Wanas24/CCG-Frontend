import axios from "axios";
import { getStoredLocale } from "@/i18n";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  config.headers.set("X-Language", getStoredLocale());
  return config;
});

export default apiClient;
