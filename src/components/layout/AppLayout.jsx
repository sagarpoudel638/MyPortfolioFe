import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import FxStrip from "./FXStrip";

export default function AppLayout({ children, title, actions }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0f1e35] text-white">

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-[210px] transform transition-transform duration-200
        lg:relative lg:translate-x-0 lg:z-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Right side */}
      <main className="flex flex-1 flex-col min-w-0 lg:ml-0">

        <Topbar
          title={title}
          actions={actions}
          onMenuClick={() => setSidebarOpen((p) => !p)}
        />

        <FxStrip />

        <div className="flex-1 overflow-auto p-3 md:p-5 space-y-4 md:space-y-6">
          {children}
        </div>

      </main>
    </div>
  );
}