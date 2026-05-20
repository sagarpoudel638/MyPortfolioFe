import { useEffect } from "react";
import { useDashboard } from "../../context/DashboardContext";
import AppLayout from "../../components/layout/AppLayout";
import { IconRefresh } from "@tabler/icons-react";
import KpiGrid from "../../components/dashboard/KpiGrid";
import PlatformTable from "../../components/dashboard/PlatformTable";
import AllocationChart from "../../components/dashboard/AllocationChart";
import HoldingsTable from "../../components/dashboard/HoldingsTable";

export default function Dashboard() {
  const { data, loading, error, lastUpdated, refresh } = useDashboard();

  useEffect(() => {
    if (!data) refresh();
  }, []);

  const allHoldings = data
    ? Object.values(data.platforms).flatMap((p) =>
        p.holdings.map((h) => ({ ...h, platformName: p.name, currency: p.currency }))
      )
    : [];

  const lastUpdatedText = lastUpdated
    ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
    : "";

  if (error) {
    return (
      <AppLayout title="Dashboard">
        <div className="text-center text-red-400">{error}</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Dashboard"
      actions={
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#5d7a9a]">{lastUpdatedText}</span>
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-sm disabled:opacity-50"
          >
            <IconRefresh size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      }
    >
      {loading && !data ? (
        <div className="text-center text-slate-400 py-20">Loading...</div>
      ) : (
        <>
          <KpiGrid
            overall={data?.overall}
            totalHoldings={allHoldings.length}
            totalPlatforms={Object.keys(data?.platforms || {}).length}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
  <div className="lg:col-span-2">
    <PlatformTable platforms={data?.platforms} />
  </div>
  <AllocationChart platforms={data?.platforms} />
</div>
          <HoldingsTable mode="dashboard" holdings={allHoldings} />
        </>
      )}
    </AppLayout>
  );
}