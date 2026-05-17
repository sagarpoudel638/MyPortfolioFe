// PlatformTable.jsx
import { IconChevronRight } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const PLATFORM_COLORS = {
  CommBank:      "#1a6bbc",
  "CommSec Pocket": "#2e82d8",
  Webull:        "#0ea5e9",
  Meroshare:     "#00c896",
};

const PLATFORM_ROUTES = {
  CommBank:         "commbank",
  "CommSec Pocket": "commsecpocket",
  Webull:           "webull",
  Meroshare:        "meroshare",
};

export default function PlatformTable({ platforms }) {
  const navigate = useNavigate();

  if (!platforms) return null;

  const rows = Object.values(platforms).map((p) => ({
    name: p.name,
    color: PLATFORM_COLORS[p.name] || "#888",
    ccy: p.currency,
    invested: p.summary.invested.toFixed(2),
    value: p.summary.current.toFixed(2),
    gain: p.summary.profit,
    returnPercent: p.summary.returnPercent,
    route: PLATFORM_ROUTES[p.name],
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs uppercase text-[#8fa3bf] font-semibold">
          Platform Breakdown
        </h2>
        <button className="text-xs text-[#2e82d8] flex items-center gap-1">
          View all <IconChevronRight size={14} />
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-[#5d7a9a] uppercase border-b border-white/10">
            <tr>
              <th className="text-left p-3">Platform</th>
              <th className="text-left p-3">Ccy</th>
              <th className="text-right p-3">Invested</th>
              <th className="text-right p-3">Value</th>
              <th className="text-right p-3">Gain</th>
              <th className="text-right p-3">Return</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => (
              <tr
                key={i}
                className="border-b border-white/5 hover:bg-white/5 cursor-pointer"
                onClick={() => navigate(`/portfolio/${p.route}`)}
              >
                <td className="p-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                  {p.name}
                </td>
                <td className="p-3 text-[#8fa3bf]">{p.ccy}</td>
                <td className="p-3 text-right">{p.invested}</td>
                <td className="p-3 text-right">{p.value}</td>
                <td className={`p-3 text-right ${p.gain >= 0 ? "text-[#00c896]" : "text-red-400"}`}>
                  {p.gain >= 0 ? "+" : ""}{p.gain.toFixed(2)}
                </td>
                <td className={`p-3 text-right ${p.returnPercent >= 0 ? "text-[#00c896]" : "text-red-400"}`}>
                  {p.returnPercent >= 0 ? "+" : ""}{p.returnPercent}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}