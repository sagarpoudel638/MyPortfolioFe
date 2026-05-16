

import AppLayout from "../../components/layout/AppLayout";

import WatchlistHeader from "../../components/watchlist/WatchlistHeader";
import WatchlistCard from "../../components/watchlist/WatchlistCard";
import InfoBox from "../../components/watchlist/InfoBox";


const buyWatchlist = [
  {
    symbol: "SOPAN",
    name: "Sopan Finance",
    price: "NPR —",
    alert: "No alert",
    priority: "medium",
    action: "Buy",
  },
  {
    symbol: "TAKSAR",
    name: "Taksar Hydropower",
    price: "NPR —",
    alert: "No alert",
    priority: "medium",
    action: "Buy",
  },
];

const sellWatchlist = [
  {
    symbol: "NHPC",
    name: "National Hydropower Co Ltd",
    price: "NPR 284",
    alert: "≥ 295",
    priority: "high",
    action: "Sell",
  },
];

export default function WatchlistPage() {
  return (
    <AppLayout title="Watchlist">
      <div className="space-y-6">

        <WatchlistHeader />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* LEFT */}
          <div>

            <WatchlistCard
              title="Stocks to Buy"
              icon="ti ti-trending-up"
              color="text-emerald-400"
              stocks={buyWatchlist}
            />

            <InfoBox
              icon="ti ti-info-circle text-emerald-400"
              text="New NEPSE IPO listings appear here with no price until secondary market opens."
            />
          </div>

          {/* RIGHT */}
          <div className="space-y-5">

            <div>
              <WatchlistCard
                title="Stocks to Sell"
                icon="ti ti-trending-down"
                color="text-red-400"
                stocks={sellWatchlist}
              />

              <InfoBox
                icon="ti ti-alert-triangle"
                color="red"
                text="NHPC is HIGH priority. Alert set at NPR 295. Current price NPR 284."
              />
            </div>

          

          </div>
        </div>
      </div>
    </AppLayout>
  );
}