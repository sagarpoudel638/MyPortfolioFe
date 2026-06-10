// src/pages/portfolio/PortfolioPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import AddToWatchlistForm from "../../components/watchlist/AddToWatchlistForm";
import { createWatchlistItem } from "../../api/watchlist";
import AppLayout from "../../components/layout/AppLayout";
import HoldingsTable from "../../components/dashboard/HoldingsTable";
import Modal from "../../components/ui/Modal";
import HoldingForm from "../../components/holdings/HoldingForm";

import { getDashboard } from "../../api/dashboard";
import { createHolding, updateHolding, deleteHolding, sellHolding, mergeHoldings } from "../../api/holdings";

const MARKET_META = {
  asx:    { name: "ASX",    currency: "AUD" },
  nyse:   { name: "NYSE",   currency: "USD" },
  nasdaq: { name: "NASDAQ", currency: "USD" },
  nepse:  { name: "NEPSE",  currency: "NPR" },
};

export default function PortfolioPage() {
  const { platform } = useParams(); // route param is still called :platform
  const meta = MARKET_META[platform];

  const [platformData, setPlatformData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = add, object = edit
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [watchlistTarget, setWatchlistTarget] = useState(null);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);

  // Sell modal state
  const [sellTarget, setSellTarget]   = useState(null);   // holding to sell from
  const [sellQty, setSellQty]         = useState("");
  const [selling, setSelling]         = useState(false);

  // Merge state
  const [merging, setMerging]         = useState(null);   // { ticker, exchange } being merged

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await getDashboard();
      setPlatformData(data.markets[platform] ?? null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [platform]);

  // ── Add / Edit submit ────────────────────────────────────────────────────
  const handleFormSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editTarget) {
        await updateHolding(editTarget._id, formData);
      } else {
        await createHolding(formData);
      }
      setModalOpen(false);
      setEditTarget(null);
      await fetchData(); // refresh live data
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save holding");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteHolding(deleteTarget._id);
      setDeleteTarget(null);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete holding");
    } finally {
      setDeleting(false);
    }
  };

  // ── Sell ─────────────────────────────────────────────────────────────────
  const handleSellSubmit = async () => {
    if (!sellTarget || !sellQty) return;
    setSelling(true);
    try {
      await sellHolding(sellTarget._id, Number(sellQty));
      setSellTarget(null);
      setSellQty("");
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to record sale");
    } finally {
      setSelling(false);
    }
  };

  // ── Merge duplicates ─────────────────────────────────────────────────────
  const handleMerge = async (ticker, exchange) => {
    setMerging({ ticker, exchange });
    try {
      await mergeHoldings(ticker, exchange);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Merge failed");
    } finally {
      setMerging(null);
    }
  };

  // ── Edit button clicked ──────────────────────────────────────────────────
  const handleEdit = (h) => {
    setEditTarget({
      ...h,
      purchaseDate: h.purchaseDate
        ? new Date(h.purchaseDate).toISOString().split("T")[0]
        : "",
    });
    setModalOpen(true);
  };

  // Add to watchlist 
  const handleAddToWatchlist = async (formData) => {
  setAddingToWatchlist(true);
  try {
    await createWatchlistItem(formData);
    setWatchlistTarget(null);
  } catch (err) {
    alert(err.response?.data?.message || "Failed to add to watchlist");
  } finally {
    setAddingToWatchlist(false);
  }
};

  if (!meta) {
    return (
      <AppLayout title="Not Found">
        <div className="text-center text-slate-400">Portfolio not found</div>
      </AppLayout>
    );
  }

  if (loading && !platformData) {
    return (
      <AppLayout title={meta.name}>
        <div className="text-center text-slate-400 py-20">Loading...</div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title={meta.name}>
        <div className="text-center text-red-400 py-20">{error}</div>
      </AppLayout>
    );
  }

  const summary = platformData?.summary || { invested: 0, current: 0, profit: 0, returnPercent: 0 };
  const holdings = platformData?.holdings || [];

  const portfolioHoldings = holdings.map((h) => ({
    ...h,
    ticker: h.symbol,
    lastTraded: h.lastTraded
      ? new Date(h.lastTraded).toLocaleString("en-AU", {
          dateStyle: "short",
          timeStyle: "short",
        })
      : "—",
  }));

  // Find tickers that appear more than once (need merging)
  const tickerCounts = portfolioHoldings.reduce((acc, h) => {
    const key = h.ticker || h.symbol;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const duplicateTickers = [...new Set(
    portfolioHoldings
      .filter((h) => tickerCounts[h.ticker || h.symbol] > 1)
      .map((h) => h.ticker || h.symbol)
  )];

  // Prepare initial values for edit form
  const editInitial = editTarget
    ? {
        market:          meta.name,  // e.g. "ASX", "NYSE"
        broker:          editTarget.broker || "",
        currency:        meta.currency,
        ticker:          editTarget.symbol || editTarget.ticker || "",
        name:            editTarget.name || "",
        qty:             editTarget.qty || "",
        buyPrice:        editTarget.buyPrice || "",
        purchaseDate:    editTarget.purchaseDate || "",
        isFreeAllotment: editTarget.isFreeAllotment || false,
        isTracking:      editTarget.isTracking ?? true,
        notes:           editTarget.notes || "",
      }
    : null;

  return (
    <AppLayout
      title={meta.name}
      actions={
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-sm"
          >
            <IconRefresh size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => { setEditTarget(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#1a6bbc] hover:bg-[#2e82d8] text-white text-sm font-medium transition"
          >
            <IconPlus size={16} />
            Add Holding
          </button>
        </div>
      }
    >

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-400">Invested ({meta.currency})</p>
          <h2 className="text-xl font-mono font-semibold">
            {summary.invested.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <p className="text-xs text-slate-400">Current Value ({meta.currency})</p>
          <h2 className="text-xl font-mono font-semibold text-emerald-400">
            {summary.current.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>

        <div className={`rounded-xl border p-4 ${
          summary.profit >= 0
            ? "border-emerald-500/30 bg-emerald-500/5"
            : "border-red-500/30 bg-red-500/5"
        }`}>
          <p className="text-xs text-slate-400">Return</p>
          <h2 className={`text-xl font-mono font-semibold ${
            summary.profit >= 0 ? "text-emerald-400" : "text-red-400"
          }`}>
            {summary.returnPercent !== null
              ? `${summary.returnPercent >= 0 ? "+" : ""}${summary.returnPercent}%`
              : "—"}
          </h2>
          <p className="text-xs text-slate-500">
            {summary.profit >= 0 ? "+" : ""}
            {summary.profit.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} profit
          </p>
        </div>
      </div>

      {/* Duplicate holdings banner */}
      {duplicateTickers.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-sm text-amber-300 font-medium mb-2">
            Duplicate holdings detected — merge to get a single weighted average entry:
          </p>
          <div className="flex flex-wrap gap-2">
            {duplicateTickers.map((ticker) => (
              <button
                key={ticker}
                onClick={() => handleMerge(ticker, meta.name)}
                disabled={!!merging}
                className="px-3 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-200 text-xs font-semibold disabled:opacity-50 transition"
              >
                {merging?.ticker === ticker ? "Merging…" : `Merge ${ticker}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Holdings Table */}
      <HoldingsTable
        mode="portfolio"
        holdings={portfolioHoldings}
        onEdit={handleEdit}
        onSell={(h) => { setSellTarget(h); setSellQty(""); }}
        onDelete={(h) => setDeleteTarget(h)}
        onAddToWatchlist={(h) => {
          setWatchlistTarget(h);
        }}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        title={editTarget ? `Edit ${editTarget.symbol || editTarget.ticker}` : "Add Holding"}
      >
        <HoldingForm
          initial={editInitial}
          onSubmit={handleFormSubmit}
          onCancel={() => { setModalOpen(false); setEditTarget(null); }}
          loading={saving}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Holding"
      >
        <p className="text-sm text-[#8fa3bf] mb-6">
          Are you sure you want to delete{" "}
          <span className="text-white font-semibold">
            {deleteTarget?.symbol || deleteTarget?.ticker}
          </span>
          ? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteTarget(null)}
            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-[#8fa3bf] text-sm font-medium rounded-lg py-2.5 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 bg-red-500/80 hover:bg-red-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg py-2.5 transition"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
      {/* Add to Watchlist Modal */}
      <Modal
        isOpen={!!watchlistTarget}
        onClose={() => setWatchlistTarget(null)}
        title="Add to Watchlist"
      >
        {watchlistTarget && (
          <AddToWatchlistForm
            ticker={watchlistTarget.symbol || watchlistTarget.ticker}
            exchange={watchlistTarget.exchange}
            onSubmit={handleAddToWatchlist}
            onCancel={() => setWatchlistTarget(null)}
            loading={addingToWatchlist}
          />
        )}
      </Modal>

      {/* Sell Modal */}
      <Modal
        isOpen={!!sellTarget}
        onClose={() => { setSellTarget(null); setSellQty(""); }}
        title={`Record Sale — ${sellTarget?.ticker || sellTarget?.symbol}`}
      >
        <p className="text-sm text-[#8fa3bf] mb-4">
          You currently hold{" "}
          <span className="text-white font-semibold">{sellTarget?.qty}</span> shares.
          Enter how many you sold.
        </p>
        <div className="mb-5">
          <label className="block text-xs text-[#5d7a9a] mb-1">Shares sold</label>
          <input
            type="number"
            min="0"
            step="any"
            value={sellQty}
            onChange={(e) => setSellQty(e.target.value)}
            placeholder={`Max ${sellTarget?.qty}`}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-[#5d7a9a] focus:outline-none focus:border-[#2e82d8]"
          />
          {sellQty && Number(sellQty) >= Number(sellTarget?.qty) && (
            <p className="text-xs text-amber-400 mt-1">
              Selling all shares — this holding will be removed.
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setSellTarget(null); setSellQty(""); }}
            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-[#8fa3bf] text-sm font-medium rounded-lg py-2.5 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSellSubmit}
            disabled={selling || !sellQty || Number(sellQty) <= 0}
            className="flex-1 bg-amber-500/80 hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg py-2.5 transition"
          >
            {selling ? "Saving…" : "Confirm Sale"}
          </button>
        </div>
      </Modal>

    </AppLayout>
  );
}