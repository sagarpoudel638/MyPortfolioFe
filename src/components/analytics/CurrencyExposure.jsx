export default function CurrencyExposure() {
  return (
    <div className="bg-[#162741] border border-white/10 rounded-lg p-4">
      <h2 className="text-xs uppercase text-gray-400 mb-3">
        Currency exposure (AUD eq.)
      </h2>

      <div className="flex gap-2">
        <div className="flex-1 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
          <p className="text-[10px] text-blue-400">AUD</p>
          <p className="text-xl font-semibold text-blue-400">60%</p>
        </div>

        <div className="flex-1 bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
          <p className="text-[10px] text-green-400">NPR</p>
          <p className="text-xl font-semibold text-green-400">12%</p>
        </div>

        <div className="flex-1 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-center">
          <p className="text-[10px] text-amber-400">USD</p>
          <p className="text-xl font-semibold text-amber-400">28%</p>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 mt-3">
        USD exposure growing due to Webull gains
      </p>
    </div>
  );
}