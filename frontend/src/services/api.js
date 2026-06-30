import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// 🔐 Attach access token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// api.js
export const getUser = async () => {
  const res = await API.get("user/"); // make sure your Django backend has this endpoint
  return res.data;
};

export default API;
