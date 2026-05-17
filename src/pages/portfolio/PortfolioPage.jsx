import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import HoldingsTable from "../../components/dashboard/HoldingsTable";
import { getDashboard } from "../../api/dashboard";

const PLATFORM_META = {
  commbank:      { name: "CommBank",       currency: "AUD" },
  commsecpocket: { name: "CommSec Pocket", currency: "AUD" },
  webull:        { name: "Webull",         currency: "USD" },
  meroshare:     { name: "Meroshare",      currency: "NPR" },
};

export default function PortfolioPage() {
  const { platform } = useParams();
  const meta = PLATFORM_META[platform];

  const [platformData, setPlatformData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await getDashboard();
        setPlatformData(data.platforms[platform] ?? null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [platform]);

  if (!meta) {
    return (
      <AppLayout title="Not Found">
        <div className="text-center text-slate-400">Portfolio not found</div>
      </AppLayout>
    );
  }

  if (loading) {
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

  if (!platformData) {
    return (
      <AppLayout title={meta.name}>
        <div className="text-center text-slate-400 py-20">No holdings found</div>
      </AppLayout>
    );
  }

  const { summary, holdings } = platformData;

  // Format holdings for HoldingsTable
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

  const handleEdit = (item) => console.log("Edit:", item);
  const handleDelete = (item) => console.log("Delete:", item);
  const handleTrade = (item) => console.log("Trade:", item);
  const handleWatchlist = (item) => console.log("Watchlist:", item);

  return (
    <AppLayout title={meta.name}>

      {/* KPI Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-400">Invested ({meta.currency})</p>
          <h2 className="text-xl font-mono font-semibold">
            {summary.invested.toLocaleString("en-AU", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <p className="text-xs text-slate-400">Current Value ({meta.currency})</p>
          <h2 className="text-xl font-mono font-semibold text-emerald-400">
            {summary.current.toLocaleString("en-AU", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
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
            {summary.profit.toLocaleString("en-AU", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} profit
          </p>
        </div>

      </div>

      {/* Holdings Table */}
      <HoldingsTable
        mode="portfolio"
        holdings={portfolioHoldings}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddToTrade={handleTrade}
        onAddToWatchlist={handleWatchlist}
      />

    </AppLayout>
  );
}