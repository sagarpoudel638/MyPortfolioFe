// pages/import/ImportPage.jsx
import { useState, useRef, useCallback } from "react";
import AppLayout from "../../components/layout/AppLayout";
import {
  IconUpload, IconDownload, IconFileTypeCsv, IconCheck,
  IconAlertTriangle, IconX, IconRefresh, IconInfoCircle,
} from "@tabler/icons-react";
import { importHoldingsCSV, exportHoldingsCSV } from "../../api/importExport";

// ── Source definitions ───────────────────────────────────────────────────────
const SOURCES = [
  {
    id:       "meroshare",
    label:    "Meroshare",
    market:   "NEPSE",
    color:    "bg-emerald-500",
    hint:     "My Shares CSV + optional WACC Report — exported from MeroShare.",
    steps:    [
      "Go to MeroShare → My Shares → Download CSV  (primary file)",
      "Optional: Go to My Purchase Source → filter Pending Scrip → add all your current scrips → go to My WACC → Download CSV",
    ],
    warning:  null,
    waccSupported: true,
  },
  {
    id:       "commsec",
    label:    "CommSec",
    market:   "ASX",
    color:    "bg-blue-500",
    hint:     "Holdings CSV — exported from CommSec portfolio page.",
    steps:    ["Go to CommSec → Portfolio → Holdings", "Click Download → Holdings (CSV)"],
    warning:  "Purchase date is not available in CommSec holdings exports — set to today's date.",
  },
  {
    id:           "webull",
    label:        "Webull",
    market:       "NASDAQ / NYSE",
    color:        "bg-cyan-500",
    hint:         "Trade record CSV(s) — exported from Webull account activity. Upload multiple files if your history spans more than 24 months.",
    steps:        [
      "Go to Webull → Account → Trade History",
      "Export as CSV — Webull limits to 24 months per export",
      "If you have more history, export multiple date ranges and upload all files together",
    ],
    warning:      null,
    multiFile:    true,
  },
  {
    id:       "native",
    label:    "MyPortfolio Export",
    market:   "All markets",
    color:    "bg-purple-500",
    hint:     "CSV exported from this app — import back or use to migrate between accounts.",
    steps:    ["Use the Export button on this page to download your current holdings", "Re-import on another account"],
    warning:  null,
  },
];

// ── Result badge ─────────────────────────────────────────────────────────────
function Badge({ count, color, label }) {
  return (
    <div className={`flex flex-col items-center p-4 rounded-xl border ${color}`}>
      <span className="text-2xl font-bold">{count}</span>
      <span className="text-xs text-slate-400 mt-0.5">{label}</span>
    </div>
  );
}

export default function ImportPage() {
  const [selectedSource, setSelectedSource] = useState(null);
  const [files,          setFiles]          = useState([]);   // array — supports Webull multi-file
  const [fileWacc,       setFileWacc]       = useState(null);
  const [dragging,       setDragging]       = useState(false);
  const [draggingWacc,   setDraggingWacc]   = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [exporting,      setExporting]      = useState(false);
  const [result,         setResult]         = useState(null);
  const [error,          setError]          = useState(null);
  const fileRef     = useRef();
  const fileWaccRef = useRef();

  const isMultiFile = selectedSource?.multiFile;
  const primaryFile = files[0] ?? null;

  // ── File handling ───────────────────────────────────────────────────────
  const handleFileDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer
      ? Array.from(e.dataTransfer.files)
      : Array.from(e.target?.files ?? []);
    const csvs = dropped.filter((f) => f.name.endsWith(".csv") || f.type === "text/csv");
    if (!csvs.length) return;
    setFiles((prev) => {
      if (isMultiFile) {
        // Deduplicate by filename
        const existing = new Set(prev.map((f) => f.name));
        return [...prev, ...csvs.filter((f) => !existing.has(f.name))];
      }
      return [csvs[0]]; // single-file sources: replace
    });
    setResult(null);
    setError(null);
  }, [isMultiFile]);

  // ── Import ──────────────────────────────────────────────────────────────
  const handleImport = async () => {
    if (!primaryFile) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data } = await importHoldingsCSV(files, selectedSource?.id || "", fileWacc || null);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Import failed. Please check the file and try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Export ──────────────────────────────────────────────────────────────
  const handleExport = async () => {
    setExporting(true);
    try {
      const res  = await exportHoldingsCSV();
      const url  = URL.createObjectURL(new Blob([res.data], { type: "text/csv" }));
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `myportfolio-holdings-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silent — nothing to show
    } finally {
      setExporting(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setFileWacc(null);
    setResult(null);
    setError(null);
    setSelectedSource(null);
  };

  const sourceInfo = selectedSource
    ? SOURCES.find((s) => s.id === selectedSource.id)
    : null;

  return (
    <AppLayout title="Import / Export">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-white">Import / Export</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Import holdings from Meroshare, CommSec, or Webull — or export your portfolio as CSV.
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a6bbc] hover:bg-[#1559a0] text-sm font-medium transition disabled:opacity-50"
        >
          {exporting ? <IconRefresh size={16} className="animate-spin" /> : <IconDownload size={16} />}
          Export Portfolio CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left: source + upload ──────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Source selector */}
          <div className="bg-[#162032] rounded-xl border border-white/8 p-5">
            <div className="text-xs font-medium text-slate-400 uppercase mb-3">
              Step 1 — Select your broker / source
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SOURCES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedSource(s); setResult(null); setError(null); }}
                  className={`flex flex-col gap-1 p-3 rounded-lg border text-left transition ${
                    selectedSource?.id === s.id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/8 hover:border-white/20 bg-[#0d1f33]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${s.color}`} />
                    <span className="text-sm font-medium text-white">{s.label}</span>
                    {selectedSource?.id === s.id && (
                      <IconCheck size={13} className="ml-auto text-blue-400" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">{s.market}</span>
                </button>
              ))}
            </div>

            {/* Instructions for selected source */}
            {sourceInfo && (
              <div className="mt-4 space-y-2">
                <div className="text-xs text-slate-400">{sourceInfo.hint}</div>
                <div className="bg-[#0d1f33] rounded-lg p-3 space-y-1">
                  {sourceInfo.steps.map((step, i) => (
                    <div key={i} className="flex gap-2 text-xs text-slate-300">
                      <span className="text-slate-500 shrink-0">{i + 1}.</span>
                      {step}
                    </div>
                  ))}
                </div>
                {sourceInfo.warning && (
                  <div className="flex gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                    <IconAlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-300">{sourceInfo.warning}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* File upload */}
          <div className="bg-[#162032] rounded-xl border border-white/8 p-5">
            <div className="text-xs font-medium text-slate-400 uppercase mb-3">
              Step 2 — Upload CSV file
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleFileDrop}
              onClick={() => fileRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition px-4 py-5 ${
                dragging
                  ? "border-blue-400 bg-blue-500/10"
                  : files.length
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-white/15 hover:border-white/30 bg-[#0d1f33]"
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                multiple={isMultiFile}
                className="hidden"
                onChange={handleFileDrop}
              />

              {files.length > 0 ? (
                <div className="w-full space-y-2" onClick={(e) => e.stopPropagation()}>
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                      <IconFileTypeCsv size={15} className="text-emerald-400 shrink-0" />
                      <span className="text-xs text-white flex-1 truncate">{f.name}</span>
                      <span className="text-[10px] text-slate-500 shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                      <button
                        onClick={() => { setFiles((prev) => prev.filter((_, j) => j !== i)); setResult(null); }}
                        className="text-slate-500 hover:text-white ml-1"
                      >
                        <IconX size={12} />
                      </button>
                    </div>
                  ))}
                  {isMultiFile && (
                    <div
                      onClick={() => fileRef.current?.click()}
                      className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white cursor-pointer py-1"
                    >
                      <IconUpload size={12} /> Add another file
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <IconUpload size={24} className="text-slate-500" />
                  <div className="text-center">
                    <p className="text-sm text-slate-300">
                      {isMultiFile ? "Drop CSV files here or click to browse" : "Drop CSV here or click to browse"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isMultiFile ? "You can select multiple files at once" : "Max 5 MB"}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* WACC file upload — shown only for Meroshare */}
            {selectedSource?.waccSupported && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">
                    WACC Report CSV
                    <span className="ml-1.5 bg-white/10 text-slate-400 text-[10px] px-1.5 py-0.5 rounded">Optional</span>
                  </span>
                  {fileWacc && (
                    <button
                      onClick={() => setFileWacc(null)}
                      className="text-xs text-slate-500 hover:text-white flex items-center gap-1"
                    >
                      <IconX size={11} /> Remove
                    </button>
                  )}
                </div>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDraggingWacc(true); }}
                  onDragLeave={() => setDraggingWacc(false)}
                  onDrop={(e) => {
                    e.preventDefault(); setDraggingWacc(false);
                    const f = e.dataTransfer?.files?.[0];
                    if (f) { setFileWacc(f); }
                  }}
                  onClick={() => fileWaccRef.current?.click()}
                  className={`flex items-center justify-center gap-3 h-14 rounded-lg border border-dashed cursor-pointer transition ${
                    draggingWacc
                      ? "border-emerald-400 bg-emerald-500/10"
                      : fileWacc
                      ? "border-emerald-500/50 bg-emerald-500/5"
                      : "border-white/10 hover:border-white/25 bg-[#0d1f33]"
                  }`}
                >
                  <input
                    ref={fileWaccRef}
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) setFileWacc(f); }}
                  />
                  {fileWacc ? (
                    <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                      <IconFileTypeCsv size={14} /> {fileWacc.name}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">
                      Drop WACC Report CSV here — enables automatic buy prices
                    </span>
                  )}
                </div>
                {!fileWacc && (
                  <p className="text-[11px] text-amber-400/80 mt-1.5">
                    Without WACC Report, buy price will be set to 0 for all NEPSE holdings.
                  </p>
                )}
                {fileWacc && (
                  <p className="text-[11px] text-emerald-400 mt-1.5">
                    ✓ WACC Report attached — buy prices will be populated automatically.
                  </p>
                )}
              </div>
            )}

            {/* Import button */}
            <button
              onClick={handleImport}
              disabled={!file || loading}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#00c896] hover:bg-[#00b085] text-[#0d1f33] font-semibold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><IconRefresh size={16} className="animate-spin" /> Importing…</>
              ) : (
                <><IconUpload size={16} /> Import Holdings</>
              )}
            </button>
            {!selectedSource && file && (
              <p className="text-xs text-slate-500 text-center mt-2">
                No source selected — format will be auto-detected from file headers.
              </p>
            )}
          </div>
        </div>

        {/* ── Right: results / info ──────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Import result */}
          {result && (
            <div className="bg-[#162032] rounded-xl border border-white/8 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Import Complete</h2>
                <button onClick={reset} className="text-xs text-slate-500 hover:text-white flex items-center gap-1">
                  <IconRefresh size={12} /> Reset
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Badge count={result.imported} color="border-emerald-500/30 text-emerald-400" label="Imported" />
                <Badge count={result.skipped}  color="border-amber-500/30 text-amber-400"    label="Skipped" />
                <Badge count={result.invalid}  color="border-red-500/30 text-red-400"        label="Invalid" />
              </div>

              <div className="text-xs text-slate-400 bg-[#0d1f33] rounded-lg px-3 py-2">
                Source detected: <span className="text-white font-medium">{result.source}</span>
              </div>

              {/* Warnings */}
              {result.warningItems?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-amber-400 flex items-center gap-1">
                    <IconAlertTriangle size={13} /> Warnings
                  </p>
                  {result.warningItems.map((w, i) => (
                    <div key={i} className="text-xs text-amber-300 bg-amber-500/10 rounded px-2 py-1.5">
                      <span className="font-medium">{w.ticker}:</span> {w.warnings.join(" ")}
                    </div>
                  ))}
                </div>
              )}

              {/* Skipped */}
              {result.skippedItems?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-400">Skipped (already exist)</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.skippedItems.map((s, i) => (
                      <span key={i} className="text-[11px] bg-white/5 rounded px-2 py-0.5 text-slate-400">
                        {s.exchange}:{s.ticker}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Invalid */}
              {result.invalidItems?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-red-400">Invalid rows</p>
                  {result.invalidItems.map((inv, i) => (
                    <div key={i} className="text-xs text-red-300 bg-red-500/10 rounded px-2 py-1.5">
                      <span className="font-medium">{inv.ticker}:</span> {inv.reason}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3">
              <IconX size={16} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-300 font-medium">Import failed</p>
                <p className="text-xs text-red-400 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Info panel */}
          {!result && !error && (
            <div className="bg-[#162032] rounded-xl border border-white/8 p-5 space-y-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <IconInfoCircle size={15} className="text-slate-400" />
                Supported Formats
              </h2>

              <div className="space-y-3 text-xs text-slate-400">
                {SOURCES.map((s) => (
                  <div key={s.id} className="flex gap-3">
                    <span className={`h-2 w-2 rounded-full ${s.color} mt-1 shrink-0`} />
                    <div>
                      <p className="text-white text-[12px] font-medium">{s.label} <span className="text-slate-500 font-normal">({s.market})</span></p>
                      <p>{s.hint}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/8 pt-4">
                <p className="text-xs font-medium text-white mb-2 flex items-center gap-1.5">
                  <IconDownload size={13} className="text-slate-400" />
                  Export Format
                </p>
                <p className="text-xs text-slate-400">
                  The export CSV includes all your holdings with ticker, name, exchange, currency, qty,
                  buy price, purchase date, broker, notes, and flags. You can re-import it anytime using the
                  <span className="text-white font-medium"> MyPortfolio Export</span> source.
                </p>
              </div>

              <div className="bg-[#0d1f33] rounded-lg p-3 text-xs text-slate-400 font-mono overflow-x-auto whitespace-nowrap">
                ticker,name,exchange,currency,qty,buyPrice,purchaseDate,...
              </div>
            </div>
          )}

          {/* Export card */}
          <div className="bg-[#162032] rounded-xl border border-white/8 p-5">
            <h2 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <IconDownload size={15} className="text-slate-400" />
              Export Your Portfolio
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Download all your holdings as a CSV file. Use it as a backup or to migrate to another account.
            </p>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/15 hover:border-white/30 text-sm text-white transition disabled:opacity-50"
            >
              {exporting ? (
                <><IconRefresh size={15} className="animate-spin" /> Generating…</>
              ) : (
                <><IconDownload size={15} /> Download holdings.csv</>
              )}
            </button>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
