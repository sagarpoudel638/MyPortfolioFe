import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import FxStrip from "../../components/layout/FXStrip.jsx";
import AppLayout from "../../components/layout/AppLayout";
import AllocationChart from "../../components/dashboard/AllocationChart";

import CurrencyExposure from "../../components/analytics/CurrencyExposure";
import PlatformPnl from "../../components/analytics/PlatformPnL.jsx";
import SectorBreakdown from "../../components/analytics/SectorBreakdown";
import PnLTimelinePlaceholder from "../../components/analytics/PnlTimelinePlaceholder.jsx";

export default function Analytics() {
  return (
     <AppLayout title="Analytics">

        <div className="p-5 space-y-6 overflow-auto">

          {/* TOP GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-[#162741] border border-white/10 rounded-lg p-4">
              <h2 className="text-xs uppercase text-gray-400 mb-3">
                Portfolio allocation
              </h2>
              <AllocationChart />
            </div>

            <CurrencyExposure />

            <PnLTimelinePlaceholder />

          </div>

          {/* BOTTOM GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <SectorBreakdown />

            <PlatformPnl />

          </div>

        </div>
     </AppLayout>
  );
}