// src/api/auth.js
import client from "./client";

export const login          = (email, password)           => client.post("/auth/login",           { email, password });
export const register       = (name, email, password)     => client.post("/auth/register",        { name, email, password });
export const logout         = (refreshToken)              => client.post("/auth/logout",          { refreshToken });
export const forgotPassword = (email)                     => client.post("/auth/forgot-password", { email });
export const resetPassword  = (token, password)           => client.post("/auth/reset-password",  { token, password });
export const changePassword = (currentPassword, newPassword) => client.put("/auth/change-password", { currentPassword, newPassword });