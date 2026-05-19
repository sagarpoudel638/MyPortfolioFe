export default function CurrencyExposure({ platforms, overall, fxRates }) {
  if (!platforms || !overall || !fxRates) return null;

  // Convert each platform's current value to AUD
  const toAUD = (value, currency) => {
    if (currency === "AUD") return value;
    if (currency === "USD") return value * fxRates.usdToAud;
    if (currency === "NPR") return value * fxRates.nprToAud;
    return value;
  };

  // Aggregate AUD-equivalent value per currency
  const currencyAUD = { AUD: 0, USD: 0, NPR: 0 };

  Object.values(platforms).forEach((p) => {
    const audValue = toAUD(p.summary.current, p.currency);
    if (currencyAUD[p.currency] !== undefined) {
      currencyAUD[p.currency] += audValue;
    }
  });

  const total = Object.values(currencyAUD).reduce((s, v) => s + v, 0);

  const currencies = [
    {
      key:       "AUD",
      label:     "AUD",
      textColor: "text-blue-400",
      bg:        "bg-blue-500/10",
      border:    "border-blue-500/20",
    },
    {
      key:       "NPR",
      label:     "NPR",
      textColor: "text-emerald-400",
      bg:        "bg-emerald-500/10",
      border:    "border-emerald-500/20",
    },
    {
      key:       "USD",
      label:     "USD",
      textColor: "text-amber-400",
      bg:        "bg-amber-500/10",
      border:    "border-amber-500/20",
    },
  ];

  const biggest = Object.entries(currencyAUD).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="bg-[#162741] border border-white/10 rounded-lg p-4">
      <h2 className="text-xs uppercase text-gray-400 mb-3">
        Currency Exposure (AUD eq.)
      </h2>

      <div className="flex gap-2 mb-3">
        {currencies.map((c) => {
          const audVal = currencyAUD[c.key];
          const pct    = total > 0
            ? ((audVal / total) * 100).toFixed(1)
            : "0.0";

          return (
            <div
              key={c.key}
              className={`flex-1 ${c.bg} border ${c.border} rounded-lg p-3 text-center`}
            >
              <p className={`text-[10px] ${c.textColor} font-semibold`}>{c.label}</p>
              <p className={`text-xl font-semibold ${c.textColor}`}>{pct}%</p>
              <p className={`text-[10px] ${c.textColor} opacity-70 mt-1 font-mono`}>
                ~AUD {audVal.toFixed(0)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bar breakdown */}
      <div className="space-y-1.5">
        {currencies.map((c) => {
          const pct = total > 0 ? (currencyAUD[c.key] / total) * 100 : 0;
          return (
            <div key={c.key} className="flex items-center gap-2">
              <span className="text-[10px] text-[#5d7a9a] w-8">{c.label}</span>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    c.key === "AUD" ? "bg-blue-500" :
                    c.key === "NPR" ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-[#5d7a9a] w-10 text-right">
                {pct.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-gray-400 mt-3">
        {biggest
          ? `${biggest[0]} is your largest exposure at ${
              ((biggest[1] / total) * 100).toFixed(1)
            }% of portfolio`
          : ""}
      </p>

      <p className="text-[10px] text-[#5d7a9a] mt-1">
        All values converted to AUD · Rates updated every {
          process.env.NODE_ENV === "production" ? "24hrs" : "1hr"
        }
      </p>
    </div>
  );
}