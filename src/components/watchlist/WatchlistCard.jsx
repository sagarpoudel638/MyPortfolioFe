// src/components/watchlist/WatchlistCard.jsx

import WatchlistItem from "./WatchlistItem";

export default function WatchlistCard({
  title,
  icon,
  color,
  stocks,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      
      <div className="mb-5 flex items-center justify-between">
        <h2
          className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-wide ${color}`}
        >
          <i className={`${icon} text-base`}></i>
          {title} ({stocks.length})
        </h2>
      </div>

      <div className="space-y-3">
        {stocks.map((stock, index) => (
          <WatchlistItem key={index} stock={stock} />
        ))}
      </div>
    </div>
  );
}