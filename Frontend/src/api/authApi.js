import api from "./axios";

export const registerUser = (data) => api.post("/auth/register", data);

export const loginUser = (data) => api.post("/auth/login", data);

export const sendOtp = (data) => api.post("/auth/send-otp", data);

export const verifyOtp = (data) => api.post("/auth/verify-otp", data);
