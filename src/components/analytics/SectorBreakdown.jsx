export default function SectorBreakdown() {
  const sectors = [
    { name: "Banking", value: "NPR 43,730", width: "65%", color: "bg-blue-500" },
    { name: "Hydro Power", value: "NPR 30,564", width: "45%", color: "bg-green-500" },
    { name: "Insurance", value: "NPR 4,280", width: "15%", color: "bg-amber-500" },
    { name: "ETFs (AUD)", value: "AUD 802.81", width: "37%", color: "bg-blue-400" },
  ];

  return (
    <div className="bg-[#162741] border border-white/10 rounded-lg p-4">
      <h2 className="text-xs uppercase text-gray-400 mb-4">
        Sector breakdown (NEPSE)
      </h2>

      <div className="space-y-3">
        {sectors.map((s) => (
          <div key={s.name}>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{s.name}</span>
              <span>{s.value}</span>
            </div>

            <div className="h-2 bg-white/10 rounded mt-1">
              <div className={`h-2 rounded ${s.color}`} style={{ width: s.width }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}