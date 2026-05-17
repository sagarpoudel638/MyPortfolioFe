// src/api/holdings.js
import client from "./client";

export const getHoldings = () => client.get("/holdings");
export const createHolding = (data) => client.post("/holdings", data);
export const updateHolding = (id, data) => client.put(`/holdings/${id}`, data);
export const deleteHolding = (id) => client.delete(`/holdings/${id}`);