

import KpiCard from "./KpiCard";
import { IconWallet, IconCoins, IconTrendingUp, IconChartBar } from "@tabler/icons-react";

export default function KpiGrid() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-5">

      <KpiCard
        title="Total Value"
        value="AUD 1,968"
        sub="≈ NPR 218,076"
        icon={<IconWallet size={16} />}
        accent
      />

      <KpiCard
        title="Total Invested"
        value="AUD 1,614"
        sub="Across 4 platforms"
        icon={<IconCoins size={16} />}
      />

      <KpiCard
        title="Total Gain"
        value="+AUD 354"
        sub="+21.9% overall return"
        icon={<IconTrendingUp size={16} />}
        accent
      />

      <KpiCard
        title="Holdings"
        value="19"
        sub="4 platforms · 3 currencies"
        icon={<IconChartBar size={16} />}
      />
    </div>
  );
}