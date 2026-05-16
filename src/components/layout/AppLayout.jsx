import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import FxStrip from "./FXStrip";

export default function AppLayout({
  children,
  title,
  actions,
}) {
  return (
    <div className="flex min-h-screen bg-[#0f1e35] text-white">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <main className="flex flex-1 flex-col">

        {/* Topbar */}
        <Topbar
          title={title}
          actions={actions}
        />

        {/* FX Strip */}
        <FxStrip />

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-5 space-y-6">
          {children}
        </div>

      </main>
    </div>
  );
}