

import { IconRefresh } from "@tabler/icons-react";

export default function Topbar() {
  return (
    <div className="px-5 py-3 border-b border-white/10 flex items-center bg-[#162741]">
      <h1 className="text-lg font-semibold flex-1">Dashboard</h1>

      <div className="flex items-center gap-3">
        <span className="text-xs text-[#5d7a9a]">
          Last updated: 2 min ago
        </span>

        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-sm">
          <IconRefresh size={16} />
          Refresh
        </button>
      </div>
    </div>
  );
}