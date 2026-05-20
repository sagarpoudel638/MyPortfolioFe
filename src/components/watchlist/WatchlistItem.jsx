// src/components/watchlist/WatchlistItem.jsx
import { IconEdit, IconTrash, IconBell, IconBellRinging } from "@tabler/icons-react";

const fmt = (n, decimals = 2) =>
  n != null ? n.toLocaleString("en-AU", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }) : "—";

const PriorityDot = ({ priority }) => (
  <span className={`w-2 h-2 rounded-full shrink-0 ${
    priority === "High"   ? "bg-red-500"   :
    priority === "Medium" ? "bg-amber-400" : "bg-slate-500"
  }`} />
);

const Badge = ({ isOwned }) => (
  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide ${
    isOwned
      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
  }`}>
    {isOwned ? "OWNED" : "WATCHING"}
  </span>
);

const CalcRow = ({ label, value, subValue, positive }) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] text-[#5d7a9a]">{label}</span>
    <div className="text-right">
      <span className={`text-xs font-mono font-semibold ${
        positive === true  ? "text-[#00c896]" :
        positive === false ? "text-red-400"   : "text-white"
      }`}>
        {value}
      </span>
      {subValue && (
        <span className={`text-[10px] font-mono ml-1 ${
          positive === true  ? "text-[#00c896]" :
          positive === false ? "text-red-400"   : "text-[#5d7a9a]"
        }`}>
          {subValue}
        </span>
      )}
    </div>
  </div>
);

export default function WatchlistItem({ item, onEdit, onDelete }) {
  const isBuy      = item.action === "Buy";
  const hasAlert   = !!item.targetPrice;
  const alertHit   = item.alertHit;
  const currency   = item.exchange === "NEPSE" ? "NPR" :
                     item.exchange === "ASX"   ? "AUD" : "USD";

  return (
    <div className={`rounded-xl border p-4 transition ${
      alertHit
        ? "border-amber-500/40 bg-amber-500/5"
        : isBuy
        ? "border-emerald-500/15 bg-white/3"
        : "border-red-500/15 bg-white/3"
    }`}>

      {/* ── Header row ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-3">
        <PriorityDot priority={item.priority} />

        <span className={`font-mono font-bold text-sm ${
          isBuy ? "text-emerald-400" : "text-red-400"
        }`}>
          {item.symbol}
        </span>

        <Badge isOwned={item.isOwned} />

        {item.sector && (
          <span className="text-[10px] text-[#5d7a9a]">{item.sector}</span>
        )}

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => onEdit(item)}
            className="p-1 rounded hover:bg-white/10 text-[#5d7a9a] hover:text-white transition"
            title="Edit"
          >
            <IconEdit size={14} />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-1 rounded hover:bg-white/10 text-[#5d7a9a] hover:text-red-400 transition"
            title="Remove"
          >
            <IconTrash size={14} />
          </button>
        </div>
      </div>

      {/* ── Price row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-white/5 rounded-lg p-2">
          <p className="text-[9px] text-[#5d7a9a] uppercase mb-0.5">Live</p>
          <p className="text-sm font-mono font-semibold text-white">
            {item.livePrice != null ? fmt(item.livePrice) : "—"}
          </p>
          {item.dayPercent != null && (
            <p className={`text-[10px] font-mono ${
              item.dayPercent >= 0 ? "text-[#00c896]" : "text-red-400"
            }`}>
              {item.dayPercent >= 0 ? "+" : ""}{item.dayPercent.toFixed(2)}%
            </p>
          )}
        </div>

        <div className="bg-white/5 rounded-lg p-2">
          <p className="text-[9px] text-[#5d7a9a] uppercase mb-0.5">
            Target {item.alertDirection === "above" ? "≥" : "≤"}
          </p>
          <p className="text-sm font-mono font-semibold text-white">
            {item.targetPrice != null ? fmt(item.targetPrice) : "—"}
          </p>
          {alertHit && (
            <p className="text-[10px] text-amber-400 font-semibold">HIT ⚡</p>
          )}
        </div>

        <div className="bg-white/5 rounded-lg p-2">
          <p className="text-[9px] text-[#5d7a9a] uppercase mb-0.5">52W Range</p>
          <p className="text-[10px] font-mono text-[#8fa3bf]">
            {item.weeklyLow52 && item.weeklyHigh52
              ? `${fmt(item.weeklyLow52, 0)} – ${fmt(item.weeklyHigh52, 0)}`
              : "—"}
          </p>
        </div>
      </div>

      {/* ── Calculator ─────────────────────────────────────────────────── */}
      {item.plannedQty ? (
        <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-1.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-[#8fa3bf] uppercase tracking-wide">
              Calculator · {item.plannedQty} units
            </span>
            <span className="text-[10px] text-[#5d7a9a]">{currency}</span>
          </div>

          {isBuy ? (
            <>
              {item.isOwned && item.avgBuyPrice && (
                <CalcRow
                  label="Avg buy price (existing)"
                  value={`${currency} ${fmt(item.avgBuyPrice)}`}
                />
              )}
              <CalcRow
                label="Cost @ target price"
                value={item.costAtTarget != null ? `${currency} ${fmt(item.costAtTarget)}` : "—"}
              />
              <CalcRow
                label="Cost @ live price"
                value={item.costAtLive != null ? `${currency} ${fmt(item.costAtLive)}` : "—"}
              />
              {item.costAtTarget && item.costAtLive && (
                <CalcRow
                  label="Difference (target vs live)"
                  value={`${currency} ${fmt(Math.abs(item.costAtLive - item.costAtTarget))}`}
                  subValue={item.costAtLive > item.costAtTarget ? "cheaper at target" : "more expensive at target"}
                />
              )}
            </>
          ) : (
            <>
              {item.avgBuyPrice && (
                <CalcRow
                  label="Avg buy price"
                  value={`${currency} ${fmt(item.avgBuyPrice)}`}
                />
              )}
              <CalcRow
                label={`P&L @ target (${item.plannedQty} units)`}
                value={item.pnlAtTarget != null
                  ? `${item.pnlAtTarget >= 0 ? "+" : ""}${currency} ${fmt(Math.abs(item.pnlAtTarget))}`
                  : "—"}
                subValue={item.pnlPctAtTarget != null
                  ? `${item.pnlPctAtTarget >= 0 ? "+" : ""}${item.pnlPctAtTarget}%`
                  : null}
                positive={item.pnlAtTarget != null ? item.pnlAtTarget >= 0 : null}
              />
              <CalcRow
                label={`P&L @ live (${item.plannedQty} units)`}
                value={item.pnlAtLive != null
                  ? `${item.pnlAtLive >= 0 ? "+" : ""}${currency} ${fmt(Math.abs(item.pnlAtLive))}`
                  : "—"}
                subValue={item.pnlPctAtLive != null
                  ? `${item.pnlPctAtLive >= 0 ? "+" : ""}${item.pnlPctAtLive}%`
                  : null}
                positive={item.pnlAtLive != null ? item.pnlAtLive >= 0 : null}
              />
              {item.totalOwnedQty > 0 && (
                <CalcRow
                  label="Total owned qty"
                  value={`${item.totalOwnedQty} units`}
                />
              )}
            </>
          )}
        </div>
      ) : (
        <div className="bg-white/5 border border-dashed border-white/10 rounded-lg px-3 py-2 text-center">
          <p className="text-[10px] text-[#5d7a9a]">
            Add planned units to see cost/P&L calculator
          </p>
        </div>
      )}

      {/* ── Notes ──────────────────────────────────────────────────────── */}
      {item.notes && (
        <p className="text-[10px] text-[#5d7a9a] mt-2 italic">{item.notes}</p>
      )}

    </div>
  );
}