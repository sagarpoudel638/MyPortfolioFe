

export default function HoldingsTable() {
  const holdings = [
    {
      ticker: "TSLA",
      name: "Tesla Inc",
      platform: "Webull",
      qty: "0.404",
      buy: "$0 (Free)",
      current: "$445.27",
      value: "USD 179.89",
      gain: "+179.89",
      return: "—",
      positive: true,
    },
    {
      ticker: "NABIL",
      name: "Nabil Bank Ltd",
      platform: "Meroshare",
      qty: "50",
      buy: "NPR 522",
      current: "NPR 527",
      value: "NPR 26,350",
      gain: "+1,008",
      return: "+3.98%",
      positive: true,
    },
    {
      ticker: "AAPL",
      name: "Apple Inc",
      platform: "Webull",
      qty: "0.240",
      buy: "$198.24",
      current: "$298.87",
      value: "USD 71.73",
      gain: "+22.74",
      return: "+46.4%",
      positive: true,
    },
    {
      ticker: "AHPC",
      name: "Arun Valley Hydro",
      platform: "Meroshare",
      qty: "20",
      buy: "NPR 317.50",
      current: "NPR 278.00",
      value: "NPR 5,560",
      gain: "-790",
      return: "-12.4%",
      positive: false,
    },
  ];

  return (
    <div>
      <h2 className="text-xs uppercase text-[#8fa3bf] font-semibold mb-3">
        Top Holdings
      </h2>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-[#5d7a9a] uppercase border-b border-white/10">
            <tr>
              <th className="text-left p-3">Ticker</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Platform</th>
              <th className="text-right p-3">Qty</th>
              <th className="text-right p-3">Buy</th>
              <th className="text-right p-3">Current</th>
              <th className="text-right p-3">Value</th>
              <th className="text-right p-3">Gain</th>
              <th className="text-right p-3">Return</th>
            </tr>
          </thead>

          <tbody>
            {holdings.map((h, i) => (
              <tr
                key={i}
                className={`border-b border-white/5 hover:bg-white/5 ${
                  !h.positive ? "bg-red-500/5" : ""
                }`}
              >
                <td className="p-3 font-semibold text-[#2e82d8]">
                  {h.ticker}
                </td>

                <td className="p-3 text-[#8fa3bf]">{h.name}</td>

                <td className="p-3 text-[#8fa3bf]">{h.platform}</td>

                <td className="p-3 text-right">{h.qty}</td>
                <td className="p-3 text-right text-[#5d7a9a]">{h.buy}</td>
                <td className="p-3 text-right">{h.current}</td>
                <td className="p-3 text-right">{h.value}</td>

                <td
                  className={`p-3 text-right ${
                    h.positive ? "text-[#00c896]" : "text-red-500"
                  }`}
                >
                  {h.gain}
                </td>

                <td
                  className={`p-3 text-right ${
                    h.positive ? "text-[#00c896]" : "text-red-500"
                  }`}
                >
                  {h.return}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}