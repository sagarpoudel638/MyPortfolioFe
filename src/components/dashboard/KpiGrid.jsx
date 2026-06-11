// KpiGrid.jsx
import { useState } from "react";
import KpiCard from "./KpiCard";
import { IconWallet, IconCoins, IconTrendingUp, IconChartBar } from "@tabler/icons-react";

const CURRENCIES = [
  { code: "AUD", symbol: "A$",  label: "AUD" },
  { code: "USD", symbol: "US$", label: "USD" },
  { code: "NPR", symbol: "NPR", label: "NPR" },
];

// Convert an AUD amount to the target currency using fxRates from the API.
// fxRates = { audToUsd, audToNpr, ... }
function convert(audAmount, targetCode, fxRates) {
  if (!fxRates || targetCode === "AUD") return audAmount;
  if (targetCode === "USD") return audAmount * (fxRates.audToUsd ?? 1);
  if (targetCode === "NPR") return audAmount * (fxRates.audToNpr ?? 1);
  return audAmount;
}

function fmt(value, symbol) {
  return `${symbol} ${Math.abs(value).toLocaleString("en-AU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function KpiGrid({ overall, fxRates, totalHoldings, totalMarkets }) {
  const [activeCurrency, setActiveCurrency] = useState("AUD");

  if (!overall) return null;

  const { invested: audInvested, current: audCurrent, profit: audProfit, returnPercent } = overall;

  const sym      = CURRENCIES.find((c) => c.code === activeCurrency)?.symbol ?? "A$";
  const invested = convert(audInvested, activeCurrency, fxRates);
  const current  = convert(audCurrent,  activeCurrency, fxRates);
  const profit   = convert(audProfit,   activeCurrency, fxRates);

  const gainPrefix = profit >= 0 ? "+" : "-";
  const gainColor  = profit >= 0 ? "text-[#00c896]" : "text-red-400";

  return (
    <div className="mb-5 space-y-3">

      {/* Currency toggle */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-[#5d7a9a] mr-1">View in</span>
        {CURRENCIES.map((c) => (
          <button
            key={c.code}
            onClick={() => setActiveCurrency(c.code)}
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition ${
              activeCurrency === c.code
                ? "bg-[#2e82d8] text-white"
                : "bg-white/5 text-[#8fa3bf] hover:bg-white/10 hover:text-white border border-white/10"
            }`}
          >
            {c.label}
          </button>
        ))}
        {activeCurrency !== "AUD" && fxRates && (
          <span className="text-[11px] text-[#5d7a9a] ml-1">
            {activeCurrency === "USD"
              ? `1 AUD = ${fxRates.audToUsd} USD`
              : `1 AUD = ${fxRates.audToNpr} NPR`}
          </span>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <KpiCard
          title="Total Value"
          value={fmt(current, sym)}
          sub={`${returnPercent != null ? (returnPercent > 0 ? "+" : "") + returnPercent + "%" : "—"} overall return`}
          icon={<IconWallet size={16} />}
          accent
        />
        <KpiCard
          title="Total Invested"
          value={fmt(invested, sym)}
          sub={`Across ${totalMarkets} markets`}
          icon={<IconCoins size={16} />}
        />
        <KpiCard
          title={profit >= 0 ? "Total Gain" : "Total Loss"}
          value={
            <span className={gainColor}>
              {gainPrefix}{fmt(profit, sym)}
            </span>
          }
          sub={`${returnPercent != null ? (returnPercent >= 0 ? "+" : "") + returnPercent + "%" : "—"} overall return`}
          icon={<IconTrendingUp size={16} />}
          accent={profit >= 0}
          loss={profit < 0}
        />
        <KpiCard
          title="Holdings"
          value={String(totalHoldings)}
          sub={`${totalMarkets} markets · 3 currencies`}
          icon={<IconChartBar size={16} />}
        />
      </div>
    </div>
  );
}
