import client from "./client";
export const getSnapshots = (days = 90) => client.get(`/snapshots?days=${days}`);
export const triggerSnapshot = () => client.post("/snapshots/trigger");