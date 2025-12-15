import axios from "axios";

const api = axios.create({
  baseURL: "https://boloform-tzcg.onrender.com/api"
});

// 🔐 Attach JWT automatically
api.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem("auth");

    if (auth) {
      const token = JSON.parse(auth)?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Handle unauthorized access
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
