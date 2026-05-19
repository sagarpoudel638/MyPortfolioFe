import { useEffect } from "react";
import { useDashboard } from "../../context/DashboardContext";
import AppLayout from "../../components/layout/AppLayout";
import AllocationChart from "../../components/dashboard/AllocationChart";
import CurrencyExposure from "../../components/analytics/CurrencyExposure";
import PlatformPnl from "../../components/analytics/PlatformPnL.jsx";
import SectorBreakdown from "../../components/analytics/SectorBreakdown";
import PnLTimeline from "../../components/analytics/PnlTimeline.jsx";

export default function Analytics() {
  const { data, loading, error, refresh } = useDashboard();

 useEffect(() => {
  refresh(); // always refresh on analytics load — not just when data is null
}, []);

  if (loading && !data) {
    return (
      <AppLayout title="Analytics">
        <div className="text-center text-slate-400 py-20">Loading...</div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Analytics">
        <div className="text-center text-red-400 py-20">{error}</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Analytics">
      <div className="p-5 space-y-6 overflow-auto">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-[#162741] border border-white/10 rounded-lg p-4">
            <h2 className="text-xs uppercase text-gray-400 mb-3">
              Portfolio Allocation
            </h2>
            <AllocationChart platforms={data?.platforms} />
          </div>

          <CurrencyExposure
  platforms={data?.platforms}
  overall={data?.overall}
  fxRates={data?.fxRates}
/>

          <PnLTimeline />

        </div>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectorBreakdown platforms={data?.platforms} />
          <PlatformPnl platforms={data?.platforms} />
        </div>

      </div>
    </AppLayout>
  );
}