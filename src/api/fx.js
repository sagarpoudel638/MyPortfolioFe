// src/api/fx.js
import client from "./client";
export const getFxRates = () => client.get("/fx");