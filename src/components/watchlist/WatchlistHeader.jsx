// src/components/watchlist/WatchlistHeader.jsx

export default function WatchlistHeader() {
  return (
    <div className="flex items-center justify-between">

      <div>
        <h1 className="text-2xl font-semibold text-white">
          Watchlist
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Track stocks you want to buy or sell.
        </p>
      </div>

      <button className="flex items-center gap-2 rounded-lg bg-[#1a6bbc] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2e82d8]">
        <i className="ti ti-plus text-base"></i>
        Add to Watchlist
      </button>
    </div>
  );
}