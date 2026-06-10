// src/api/holdings.js
import client from "./client";

export const getHoldings = () => client.get("/holdings");
export const createHolding = (data) => client.post("/holdings", data);
export const updateHolding = (id, data) => client.put(`/holdings/${id}`, data);
export const deleteHolding = (id) => client.delete(`/holdings/${id}`);

// Reduce qty by sellQty; holding is deleted server-side when qty reaches 0.
export const sellHolding = (id, sellQty) =>
  client.put(`/holdings/${id}/sell`, { sellQty });

// Merge all holdings for the same ticker+exchange into one (weighted avg price).
export const mergeHoldings = (ticker, exchange) =>
  client.post("/holdings/merge", { ticker, exchange });