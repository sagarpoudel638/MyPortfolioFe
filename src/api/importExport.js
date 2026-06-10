import client from "./client";

/**
 * Upload a CSV file and import holdings.
 * @param {File}   file   - CSV file object
 * @param {string} source - "meroshare" | "commsec" | "webull" | "native" | "" (auto-detect)
 */
export const importHoldingsCSV = (file, source = "") => {
  const form = new FormData();
  form.append("file", file);
  if (source) form.append("source", source);
  return client.post("/import", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Download all holdings as CSV.
 * Returns a blob URL the caller can trigger as a download.
 */
export const exportHoldingsCSV = () =>
  client.get("/export", { responseType: "blob" });
