export default function PlatformPnl() {
  const data = [
    { name: "CommBank", value: 6.2, width: "10%", color: "bg-blue-500" },
    { name: "CommSec", value: 11.57, width: "20%", color: "bg-blue-400" },
    { name: "Webull", value: 312.01, width: "90%", color: "bg-cyan-400" },
    { name: "Meroshare", value: 29.74, width: "30%", color: "bg-emerald-400" },
  ];

  return (
    <div className="bg-[#162741] border border-white/10 rounded-lg p-4">
      <h2 className="text-xs uppercase text-gray-400 mb-4">
        P&L by platform
      </h2>

      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{item.name}</span>
              <span className="text-green-400">
                +AUD {item.value}
              </span>
            </div>

            <div className="h-2 bg-white/10 rounded mt-1">
              <div className={`h-2 rounded ${item.color}`} style={{ width: item.width }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}