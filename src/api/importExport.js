import client from "./client";

/**
 * Upload CSV file(s) and import holdings.
 * @param {File|File[]} files    - One or more CSV files (array for Webull multi-period)
 * @param {string}      source   - "meroshare" | "commsec" | "webull" | "native" | ""
 * @param {File|null}   fileWacc - Optional Meroshare WACC Report CSV
 */
export const importHoldingsCSV = (files, source = "", fileWacc = null) => {
  const form     = new FormData();
  const fileList = Array.isArray(files) ? files : [files];
  fileList.forEach((f) => form.append("file", f));
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
