import { useState, useEffect } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { IconRefresh } from "@tabler/icons-react";

import KpiGrid from "../../components/dashboard/KpiGrid";
import PlatformTable from "../../components/dashboard/PlatformTable";
import AllocationChart from "../../components/dashboard/AllocationChart";
import HoldingsTable from "../../components/dashboard/HoldingsTable";

import { getDashboard } from "../../api/dashboard";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: res } = await getDashboard();
      setData(res);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Flatten all holdings across all platforms for the holdings table
  const allHoldings = data
    ? Object.values(data.platforms).flatMap((p) =>
        p.holdings.map((h) => ({ ...h, platformName: p.name, currency: p.currency }))
      )
    : [];

  // Format last updated time
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
            onClick={fetchDashboard}
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

<div className="grid grid-cols-3 gap-4">
  <div className="col-span-2">
    <PlatformTable platforms={data?.platforms} />
  </div>
  <AllocationChart platforms={data?.platforms} />
</div>

<HoldingsTable
  mode="dashboard"
  holdings={allHoldings}
/>
        </>
      )}
    </AppLayout>
  );
}