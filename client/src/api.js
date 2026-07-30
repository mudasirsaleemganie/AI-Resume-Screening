import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 35000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("talentlens_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("talentlens_token")) {
      localStorage.removeItem("talentlens_token");
      localStorage.removeItem("talentlens_user");
      window.dispatchEvent(new Event("auth-expired"));
    }
    return Promise.reject(error);
  }
);

export default api;

