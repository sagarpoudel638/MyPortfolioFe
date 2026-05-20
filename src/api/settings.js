import client from "./client";

export const getProfile           = ()     => client.get("/settings/profile");
export const updateProfile        = (data) => client.put("/settings/profile",       data);
export const updateNotifications  = (data) => client.put("/settings/notifications", data);
export const deleteAccount        = (password) => client.delete("/settings/account", { data: { password } });