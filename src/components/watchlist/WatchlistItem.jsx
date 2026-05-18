// src/components/watchlist/WatchlistItem.jsx

import { IconTrash, IconBell, IconBellRinging } from "@tabler/icons-react";

export default function WatchlistItem({ stock, onDelete }) {
  const isSell = stock.action === "Sell";
  const hasAlert = stock.alert !== "No alert";
  const alertHit = stock.alertHit;

  return (
    <div className={`flex items-center gap-4 rounded-xl border p-4 transition ${
      alertHit
        ? "border-amber-500/40 bg-amber-500/5"
        : isSell
        ? "border-red-500/20 bg-red-500/5"
        : "border-white/10 bg-[#162741] hover:bg-white/5"
    }`}>

      {/* Priority dot */}
      <div className={`h-2 w-2 rounded-full shrink-0 ${
        stock.priority === "high"   ? "bg-red-500" :
        stock.priority === "medium" ? "bg-amber-400" :
                                      "bg-slate-500"
      }`} />

      {/* Symbol + Exchange */}
      <div className="w-[80px] shrink-0">
        <p className={`font-mono font-semibold text-sm ${
          isSell ? "text-red-400" : "text-[#2e82d8]"
        }`}>
          {stock.symbol}
        </p>
        <p className="text-[10px] text-[#5d7a9a]">{stock.exchange}</p>
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-300 truncate">{stock.name}</p>
        {stock.notes && (
          <p className="text-[10px] text-[#5d7a9a] truncate mt-0.5">{stock.notes}</p>
        )}
      </div>

      {/* Live Price */}
      <div className="w-[100px] text-right shrink-0">
        {stock.livePrice !== null ? (
          <>
            <p className="font-mono text-sm text-white">
              {stock.livePrice.toLocaleString()}
            </p>
            {stock.dayPct !== null && (
              <p className={`text-[10px] font-mono ${
                stock.dayPct >= 0 ? "text-[#00c896]" : "text-red-400"
              }`}>
                {stock.dayPct >= 0 ? "+" : ""}{stock.dayPct.toFixed(2)}%
              </p>
            )}
          </>
        ) : (
          <p className="text-xs text-[#5d7a9a]">—</p>
        )}
      </div>

      {/* Alert */}
      <div className={`w-[110px] flex items-center gap-1 text-xs shrink-0 ${
        alertHit    ? "text-amber-400" :
        isSell      ? "text-red-400"   :
        hasAlert    ? "text-[#00c896]" :
                      "text-slate-400"
      }`}>
        {hasAlert
          ? <IconBellRinging size={13} />
          : <IconBell size={13} />
        }
        <span>{stock.alert}</span>
        {alertHit && (
          <span className="ml-1 bg-amber-500/20 text-amber-400 text-[9px] font-semibold px-1.5 py-0.5 rounded">
            HIT
          </span>
        )}
      </div>

      {/* Action badge */}
      <span className={`rounded-md px-3 py-1 text-xs font-semibold shrink-0 ${
        isSell
          ? "bg-red-500/15 text-red-400"
          : "bg-emerald-500/15 text-emerald-400"
      }`}>
        {stock.action}
      </span>

      {/* Delete */}
      <button
        onClick={() => onDelete?.(stock)}
        className="hover:bg-white/10 p-1 rounded text-[#5d7a9a] hover:text-red-400 transition shrink-0"
        title="Remove"
      >
        <IconTrash size={14} />
      </button>

    </div>
  );
}