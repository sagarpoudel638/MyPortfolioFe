// src/api/watchlist.js
import client from "./client";

export const getWatchlist = () => client.get("/watchlist");
export const createWatchlistItem = (data) => client.post("/watchlist", data);
export const updateWatchlistItem = (id, data) => client.put(`/watchlist/${id}`, data);
export const deleteWatchlistItem = (id) => client.delete(`/watchlist/${id}`);
export const getWatchlistPrices = () => client.get("/watchlist/prices");
export const getEnrichedWatchlist = () => client.get("/watchlist/enriched");