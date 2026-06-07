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
import { createHolding, updateHolding, deleteHolding } from "../../api/holdings";

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

      {/* Holdings Table */}
      <HoldingsTable
        mode="portfolio"
        holdings={portfolioHoldings}
        onEdit={handleEdit}
        onDelete={(h) => setDeleteTarget(h)}
        onAddToWatchlist={(h) => {
  console.log("watchlist target:", h);
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

    </AppLayout>
  );
}