// src/components/watchlist/WatchlistItem.jsx

export default function WatchlistItem({ stock }) {
  const isSell = stock.action === "Sell";

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border p-4 transition
      ${
        isSell
          ? "border-red-500/20 bg-red-500/5"
          : "border-white/10 bg-[#162741] hover:bg-white/5"
      }`}
    >
      {/* Priority */}
      <div
        className={`h-2 w-2 rounded-full ${
          stock.priority === "high"
            ? "bg-red-500"
            : stock.priority === "medium"
            ? "bg-amber-400"
            : "bg-slate-500"
        }`}
      ></div>

      {/* Symbol */}
      <div className="w-[90px]">
        <p
          className={`font-mono font-semibold ${
            isSell ? "text-red-400" : "text-[#2e82d8]"
          }`}
        >
          {stock.symbol}
        </p>
      </div>

      {/* Name */}
      <div className="flex-1">
        <p className="text-sm text-slate-300">{stock.name}</p>
      </div>

      {/* Price */}
      <div className="w-[90px] text-right font-mono text-sm text-white">
        {stock.price}
      </div>

      {/* Alert */}
      <div
        className={`w-[110px] flex items-center gap-1 text-xs ${
          isSell ? "text-red-400" : "text-slate-400"
        }`}
      >
        <i
          className={`ti ${
            stock.alert === "No alert"
              ? "ti-bell"
              : "ti-bell-ringing"
          }`}
        ></i>

        {stock.alert}
      </div>

      {/* Action */}
      <span
        className={`rounded-md px-3 py-1 text-xs font-semibold ${
          isSell
            ? "bg-red-500/15 text-red-400"
            : "bg-emerald-500/15 text-emerald-400"
        }`}
      >
        {stock.action}
      </span>
    </div>
  );
}