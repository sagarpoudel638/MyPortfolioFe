export default function PnLTimelinePlaceholder() {
  return (
    <div className="bg-[#162741] border border-white/10 rounded-lg p-4">
      <h2 className="text-xs uppercase text-gray-400 mb-3">
        P&L over time
      </h2>

      <div className="h-[120px] border border-dashed border-white/20 rounded-lg flex items-center justify-center text-gray-500 text-sm">
        Chart will populate after daily snapshots
      </div>
    </div>
  );
}