const PLATFORM_COLORS = {
  CommBank:         "bg-blue-500",
  "CommSec Pocket": "bg-blue-400",
  Webull:           "bg-cyan-400",
  Meroshare:        "bg-emerald-400",
};

const PLATFORM_TEXT = {
  CommBank:         "text-blue-400",
  "CommSec Pocket": "text-blue-300",
  Webull:           "text-cyan-400",
  Meroshare:        "text-emerald-400",
};

export default function PlatformPnl({ platforms }) {
  if (!platforms) return null;

  const rows = Object.values(platforms).map((p) => ({
    name:     p.name,
    profit:   p.summary.profit,
    currency: p.currency,
    color:    PLATFORM_COLORS[p.name] || "bg-slate-400",
    textColor: PLATFORM_TEXT[p.name]  || "text-slate-400",
  }));

  const maxAbsProfit = Math.max(...rows.map((r) => Math.abs(r.profit)), 1);

  return (
    <div className="bg-[#162741] border border-white/10 rounded-lg p-4">
      <h2 className="text-xs uppercase text-gray-400 mb-4">P&L by Platform</h2>

      <div className="space-y-3">
        {rows.map((item) => {
          const barWidth = `${Math.round((Math.abs(item.profit) / maxAbsProfit) * 100)}%`;
          const isPositive = item.profit >= 0;

          return (
            <div key={item.name}>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{item.name}</span>
                <span className={isPositive ? "text-[#00c896]" : "text-red-400"}>
                  {isPositive ? "+" : ""}{item.currency} {item.profit.toFixed(2)}
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded">
                <div
                  className={`h-2 rounded transition-all ${
                    isPositive ? item.color : "bg-red-500"
                  }`}
                  style={{ width: barWidth }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}