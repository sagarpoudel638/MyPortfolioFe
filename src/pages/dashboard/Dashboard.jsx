import AppLayout from "../../components/layout/AppLayout";
import { IconRefresh } from "@tabler/icons-react";

import KpiGrid from "../../components/dashboard/KpiGrid";
import PlatformTable from "../../components/dashboard/PlatformTable";
import AllocationChart from "../../components/dashboard/AllocationChart";
import HoldingsTable from "../../components/dashboard/HoldingsTable";

import { portfolioData } from "../../data/portfolioData";

export default function Dashboard() {

  const dashboardHoldings = [
    ...portfolioData.meroshare.holdings,
    ...portfolioData.commbank.holdings,
  ];

  return (
    <AppLayout
      title="Dashboard"
      actions={
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#5d7a9a]">
            Last updated: 2 min ago
          </span>

          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-sm">
            <IconRefresh size={16} />
            Refresh
          </button>
        </div>
      }
    >

      <KpiGrid />

      <div className="grid grid-cols-3 gap-4">

        <div className="col-span-2">
          <PlatformTable />
        </div>

        <AllocationChart />

      </div>

      <HoldingsTable
        mode="dashboard"
        holdings={dashboardHoldings}
      />

    </AppLayout>
  );
}