// src/components/watchlist/WatchlistCard.jsx

import WatchlistItem from "./WatchlistItem";

export default function WatchlistCard({ title, icon, color, stocks, onDelete }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-wide ${color}`}>
          <i className={`${icon} text-base`} />
          {title} ({stocks.length})
        </h2>
      </div>

      {stocks.length === 0 ? (
        <p className="text-xs text-[#5d7a9a] text-center py-4">No items yet</p>
      ) : (
        <div className="space-y-3">
          {stocks.map((stock, index) => (
            <WatchlistItem
              key={stock._id || index}
              stock={stock}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}