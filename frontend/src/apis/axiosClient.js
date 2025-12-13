import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Optional: attach token if you have it later
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ck_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Optional: unwrap response.data
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default axiosClient;
