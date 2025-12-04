import axios from "axios";

const api = axios.create({
  // Same-origin /api by default so Vite proxy handles local dev; override via VITE_API_BASE_URL if needed.
  baseURL: import.meta.env?.VITE_API_BASE_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
