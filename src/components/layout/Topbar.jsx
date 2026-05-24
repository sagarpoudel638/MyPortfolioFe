import { IconMenu2 } from "@tabler/icons-react";
import MarketStatusBar from "./MarketStatusBar";

export default function Topbar({ title, actions, onMenuClick }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-[#162741] px-4 py-3 gap-3">

      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-[#5d7a9a] hover:text-white transition shrink-0"
      >
        <IconMenu2 size={20} />
      </button>

      <h1 className="text-base font-semibold flex-1 truncate">{title}</h1>

      {/* Market status badges */}
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <MarketStatusBar />
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}

    </div>
  );
}