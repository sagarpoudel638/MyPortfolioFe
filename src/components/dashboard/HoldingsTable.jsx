// src/components/dashboard/HoldingsTable.jsx
import { IconEdit, IconTrash, IconEye, IconArrowDown } from "@tabler/icons-react";

export default function HoldingsTable({
  mode = "dashboard",
  holdings = [],
  onEdit,
  onDelete,
  onSell,
  onAddToWatchlist,
}) {
  const isPortfolio = mode === "portfolio";

  return (
  <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
    <div className="min-w-[700px]">
      <table className="w-full text-sm">

        {/* HEADER */}
        <thead className="border-b border-white/10 text-xs uppercase text-[#5d7a9a]">
          <tr>
            <th className="p-3 text-left">Ticker</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-right">Qty</th>
            <th className="p-3 text-right">Buy Price</th>
            <th className="p-3 text-right">Invested</th>
            <th className="p-3 text-right">Current</th>
            <th className="p-3 text-right">Value</th>
            <th className="p-3 text-right">Gain</th>
            {isPortfolio && (
              <>
                <th className="p-3 text-right">Day %</th>
                <th className="p-3 text-right">52W</th>
                <th className="p-3 text-right">Last Traded</th>
                <th className="p-3 text-right">Actions</th>
              </>
            )}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {holdings.map((h, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/5">

              <td className="p-3 font-semibold text-[#2e82d8]">
                {h.ticker || h.symbol}
              </td>

              <td className="p-3 text-[#8fa3bf]">
                <div>{h.name}</div>
                {h.platformName && (
                  <div className="text-[10px] text-[#5d7a9a]">{h.platformName}</div>
                )}
              </td>

              <td className="p-3 text-right font-mono">{h.qty}</td>

              <td className="p-3 text-right text-[#5d7a9a]">{h.buyPrice}</td>

              <td className="p-3 text-right font-mono">
                {h.invested != null ? h.invested : "—"}
              </td>

              <td className="p-3 text-right font-mono">
                {h.current != null ? h.current : "—"}
              </td>

              <td className="p-3 text-right font-mono">
                {h.value != null ? h.value : "—"}
              </td>

              <td className={`p-3 text-right font-mono ${
                (h.gain ?? 0) >= 0 ? "text-[#00c896]" : "text-red-500"
              }`}>
                {h.gain != null
                  ? `${h.gain >= 0 ? "+" : ""}${h.gain}`
                  : "—"}
              </td>

              {isPortfolio && (
                <>
                  <td className="p-3 text-right">
                    {h.dayPct ?? "—"}
                  </td>

                  <td className="p-3 text-right text-[#5d7a9a]">
                    {h.low52 && h.high52
                      ? `${h.low52} – ${h.high52}`
                      : "—"}
                  </td>

                  <td className="p-3 text-right text-[11px] text-[#5d7a9a]">
                    {h.lastTraded ?? "—"}
                  </td>

                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit?.(h)}
                        className="hover:bg-white/10 p-1 rounded text-[#8fa3bf] hover:text-white transition"
                        title="Edit"
                      >
                        <IconEdit size={16} />
                      </button>

                      <button
                        onClick={() => onSell?.(h)}
                        className="hover:bg-white/10 p-1 rounded text-amber-400 hover:text-amber-300 transition"
                        title="Record Sale"
                      >
                        <IconArrowDown size={16} />
                      </button>

                      <button
                        onClick={() => onDelete?.(h)}
                        className="hover:bg-white/10 p-1 rounded text-red-400 hover:text-red-300 transition"
                        title="Delete"
                      >
                        <IconTrash size={16} />
                      </button>

                      <button
                        onClick={() => onAddToWatchlist?.(h)}
                        className="hover:bg-white/10 p-1 rounded text-[#8fa3bf] hover:text-[#00c896] transition"
                        title="Add to Watchlist"
                      >
                        <IconEye size={16} />
                      </button>
                    </div>
                  </td>
                </>
              )}

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  </div>
);
}