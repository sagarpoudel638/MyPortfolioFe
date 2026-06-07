// PlatformTable.jsx
import { IconChevronRight } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const MARKET_COLORS = {
  ASX:    "#1a6bbc",
  NYSE:   "#2e82d8",
  NASDAQ: "#0ea5e9",
  NEPSE:  "#00c896",
};

export default function PlatformTable({ platforms }) {
  const navigate = useNavigate();

  if (!platforms) return null;

  // platforms prop is now the markets object from the API
  const rows = Object.entries(platforms).map(([key, m]) => ({
    key,
    name: m.name,
    color: MARKET_COLORS[m.name] || "#888",
    ccy: m.currency,
    invested: m.summary.invested.toFixed(2),
    value: m.summary.current.toFixed(2),
    gain: m.summary.profit,
    returnPercent: m.summary.returnPercent,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs uppercase text-[#8fa3bf] font-semibold">
          Market Breakdown
        </h2>
        <button className="text-xs text-[#2e82d8] flex items-center gap-1">
          View all <IconChevronRight size={14} />
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-[#5d7a9a] uppercase border-b border-white/10">
            <tr>
              <th className="text-left p-3">Market</th>
              <th className="text-left p-3">Ccy</th>
              <th className="text-right p-3">Invested</th>
              <th className="text-right p-3">Value</th>
              <th className="text-right p-3">Gain</th>
              <th className="text-right p-3">Return</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m, i) => (
              <tr
                key={i}
                className="border-b border-white/5 hover:bg-white/5 cursor-pointer"
                onClick={() => navigate(`/portfolio/${m.key}`)}
              >
                <td className="p-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                  {m.name}
                </td>
                <td className="p-3 text-[#8fa3bf]">{m.ccy}</td>
                <td className="p-3 text-right">{m.invested}</td>
                <td className="p-3 text-right">{m.value}</td>
                <td className={`p-3 text-right ${m.gain >= 0 ? "text-[#00c896]" : "text-red-400"}`}>
                  {m.gain >= 0 ? "+" : ""}{m.gain.toFixed(2)}
                </td>
                <td className={`p-3 text-right ${m.returnPercent >= 0 ? "text-[#00c896]" : "text-red-400"}`}>
                  {m.returnPercent >= 0 ? "+" : ""}{m.returnPercent}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}