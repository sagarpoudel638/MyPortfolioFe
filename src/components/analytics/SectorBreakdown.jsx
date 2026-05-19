export default function SectorBreakdown({ platforms }) {
  if (!platforms) return null;

  const meroshare = platforms.meroshare;
  if (!meroshare) return null;

  const SECTOR_COLORS = {
    "Commercial Banks":        "bg-blue-500",
    "Development Banks":       "bg-blue-400",
    "Finance":                 "bg-blue-300",
    "Hydro Power":             "bg-green-500",
    "Life Insurance":          "bg-amber-500",
    "Non Life Insurance":      "bg-amber-400",
    "Microfinance":            "bg-purple-400",
    "Manufacturing And Processing": "bg-orange-400",
    "Investment":              "bg-cyan-400",
    "Hotels And Tourism":      "bg-pink-400",
    "Tradings":                "bg-red-400",
    "Mutual Fund":             "bg-indigo-400",
    "Others":                  "bg-slate-400",
  };

  // Aggregate by sector — use live sector from price data
  const sectorTotals = {};

  meroshare.holdings.forEach((h) => {
    if (h.isTracking === false) return;
    const sector = h.sector || "Others";
    if (!sectorTotals[sector]) {
      sectorTotals[sector] = { value: 0, invested: 0 };
    }
    sectorTotals[sector].value    += h.value    ?? 0;
    sectorTotals[sector].invested += h.invested ?? 0;
  });

  const rows = Object.entries(sectorTotals)
    .sort((a, b) => b[1].value - a[1].value);

  const maxValue = Math.max(...rows.map(([, v]) => v.value), 1);

  return (
    <div className="bg-[#162741] border border-white/10 rounded-lg p-4">
      <h2 className="text-xs uppercase text-gray-400 mb-4">
        Sector Breakdown — NEPSE
      </h2>

      {rows.length === 0 ? (
        <p className="text-xs text-[#5d7a9a] text-center py-4">
          No sector data yet — will populate after next price fetch
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map(([sector, data]) => {
            const barWidth = `${Math.round((data.value / maxValue) * 100)}%`;
            const color = SECTOR_COLORS[sector] || "bg-slate-400";
            const gain = data.value - data.invested;
            const isPositive = gain >= 0;

            return (
              <div key={sector}>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{sector}</span>
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-[10px] ${
                      isPositive ? "text-[#00c896]" : "text-red-400"
                    }`}>
                      {isPositive ? "+" : ""}NPR {gain.toLocaleString("en-AU", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                    <span className="font-mono text-white">
                      NPR {data.value.toLocaleString("en-AU", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-white/10 rounded">
                  <div
                    className={`h-2 rounded transition-all ${color}`}
                    style={{ width: barWidth }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[10px] text-[#5d7a9a] mt-4">
        NEPSE holdings only · Values in NPR · Sector from merolagani.com
      </p>
    </div>
  );
}