import api from "./axios";

// Signup
export const signup = (data) => api.post("/user/sign-up", data);

// Login
export const login = (data) => api.post("/user/log-in", data);

// Logout
export const logout = () => api.get("/logout");

// forgot password
export const forgotPassword = (data) => api.post("/user/forgot-password", data);

// reset password
export const resetPassword = (token, data) => api.post(`/user/reset-password/${token}`, data);
