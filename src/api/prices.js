// src/api/prices.js
import client from "./client";
export const getMarketStatus = () => client.get("/prices/market-status");

// Returns { found: bool, price: number|null }
export const verifyTicker = (ticker, exchange) =>
  client.get("/prices/verify", { params: { ticker, exchange } });