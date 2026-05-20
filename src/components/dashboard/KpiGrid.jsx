// KpiGrid.jsx
import KpiCard from "./KpiCard";
import { IconWallet, IconCoins, IconTrendingUp, IconChartBar } from "@tabler/icons-react";

export default function KpiGrid({ overall, totalHoldings, totalPlatforms }) {
  if (!overall) return null;

  const { currency, invested, current, profit, returnPercent } = overall;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5">
      <KpiCard
        title="Total Value"
        value={`${currency} ${current.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        sub={`${returnPercent > 0 ? "+" : ""}${returnPercent}% overall return`}
        icon={<IconWallet size={16} />}
        accent
      />
      <KpiCard
        title="Total Invested"
        value={`${currency} ${invested.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        sub={`Across ${totalPlatforms} platforms`}
        icon={<IconCoins size={16} />}
      />
      <KpiCard
        title="Total Gain"
        value={`${profit >= 0 ? "+" : ""}${currency} ${Math.abs(profit).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        sub={`${returnPercent >= 0 ? "+" : ""}${returnPercent}% overall return`}
        icon={<IconTrendingUp size={16} />}
        accent={profit >= 0}
      />
      <KpiCard
        title="Holdings"
        value={String(totalHoldings)}
        sub={`${totalPlatforms} platforms · 3 currencies`}
        icon={<IconChartBar size={16} />}
      />
    </div>
  );
}