const MARKET_COLORS = {
  ASX:    "bg-blue-500",
  NYSE:   "bg-blue-400",
  NASDAQ: "bg-cyan-400",
  NEPSE:  "bg-emerald-400",
};

const MARKET_TEXT = {
  ASX:    "text-blue-400",
  NYSE:   "text-blue-300",
  NASDAQ: "text-cyan-400",
  NEPSE:  "text-emerald-400",
};

export default function PlatformPnl({ platforms }) {
  if (!platforms) return null;

  const rows = Object.values(platforms).map((m) => ({
    name:      m.name,
    profit:    m.summary.profit,
    currency:  m.currency,
    color:     MARKET_COLORS[m.name] || "bg-slate-400",
    textColor: MARKET_TEXT[m.name]   || "text-slate-400",
  }));

  const maxAbsProfit = Math.max(...rows.map((r) => Math.abs(r.profit)), 1);

  return (
    <div className="bg-[#162741] border border-white/10 rounded-lg p-4">
      <h2 className="text-xs uppercase text-gray-400 mb-4">P&L by Market</h2>

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