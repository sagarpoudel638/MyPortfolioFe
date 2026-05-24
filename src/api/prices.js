// src/api/prices.js
import client from "./client";
export const getMarketStatus = () => client.get("/prices/market-status");