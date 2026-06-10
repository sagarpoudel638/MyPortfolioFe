import client from "./client";

/**
 * Upload CSV file(s) and import holdings.
 * @param {File}        file     - Primary CSV (My Shares, CommSec, Webull, etc.)
 * @param {string}      source   - "meroshare" | "commsec" | "webull" | "native" | ""
 * @param {File|null}   fileWacc - Optional Meroshare WACC Report CSV
 */
export const importHoldingsCSV = (file, source = "", fileWacc = null) => {
  const form = new FormData();
  form.append("file", file);
  if (source)   form.append("source",   source);
  if (fileWacc) form.append("fileWacc", fileWacc);
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
