import { useParams } from "react-router-dom";

import AppLayout from "../../components/layout/AppLayout";
import HoldingsTable from "../../components/dashboard/HoldingsTable";

import { portfolioData } from "../../data/portfolioData";

export default function PortfolioPage() {
  const { platform } = useParams();

  const data = portfolioData[platform];

  if (!data) {
    return (
      <AppLayout title="Not Found">
        <div className="text-center text-slate-400">
          Portfolio not found
        </div>
      </AppLayout>
    );
  }


  const portfolioHoldings = data.holdings.map((h) => {
    const invested = h.qty * h.buyPrice;
    const value = h.qty * h.current;
    const gain = value - invested;

    return {
      ...h,
      ticker: h.symbol,
      invested,
      value,
      gain,
      platform: data.name,
    };
  });


  const handleEdit = (item) => console.log("Edit:", item);
  const handleDelete = (item) => console.log("Delete:", item);
  const handleTrade = (item) => console.log("Trade:", item);
  const handleWatchlist = (item) =>
    console.log("Watchlist:", item);

  return (
    <AppLayout title={data.name}>

      {/* KPI Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-400">
            Invested ({data.currency})
          </p>
          <h2 className="text-xl font-mono font-semibold">
            {data.summary.invested}
          </h2>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <p className="text-xs text-slate-400">
            Current Value ({data.currency})
          </p>
          <h2 className="text-xl font-mono font-semibold text-emerald-400">
            {data.summary.current}
          </h2>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <p className="text-xs text-slate-400">
            Return
          </p>

          <h2 className="text-xl font-mono font-semibold text-emerald-400">
            {data.summary.returnPercent}%
          </h2>

          <p className="text-xs text-slate-500">
            +{data.summary.profit} profit
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