import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import FxStrip from "../../components/layout/FXStrip.jsx";
import KpiGrid from "../../components/dashboard/KpiGrid";
import PlatformTable from "../../components/dashboard/PlatformTable";
import AllocationChart from "../../components/dashboard/AllocationChart";
import HoldingsTable from "../../components/dashboard/HoldingsTable";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#0f1e35] text-white">

      <Sidebar />

      <main className="flex-1 flex flex-col">

        <Topbar />
        <FxStrip />

        <div className="p-5 space-y-6 overflow-auto">

          <KpiGrid />

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <PlatformTable />
            </div>

            <AllocationChart />
          </div>

          <HoldingsTable />

        </div>

      </main>
    </div>
  );
}