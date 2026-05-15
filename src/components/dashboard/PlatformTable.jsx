

import { IconChevronRight } from "@tabler/icons-react";

export default function PlatformTable() {
  const data = [
    {
      name: "CommBank",
      color: "#1a6bbc",
      ccy: "AUD",
      invested: "572.40",
      value: "578.60",
      gain: "+6.20",
      return: "+1.1%",
      positive: true,
    },
    {
      name: "CommSec Pocket",
      color: "#2e82d8",
      ccy: "AUD",
      invested: "212.64",
      value: "224.21",
      gain: "+11.57",
      return: "+5.4%",
      positive: true,
    },
    {
      name: "Webull",
      color: "#0ea5e9",
      ccy: "USD",
      invested: "247.63",
      value: "559.64",
      gain: "+312.01",
      return: "+126.0%",
      positive: true,
    },
    {
      name: "Meroshare",
      color: "#00c896",
      ccy: "NPR",
      invested: "64413.70",
      value: "67101.90",
      gain: "+2688.20",
      return: "+4.2%",
      positive: true,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs uppercase text-[#8fa3bf] font-semibold">
          Platform Breakdown
        </h2>

        <button className="text-xs text-[#2e82d8] flex items-center gap-1">
          View all <IconChevronRight size={14} />
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-[#5d7a9a] uppercase border-b border-white/10">
            <tr>
              <th className="text-left p-3">Platform</th>
              <th className="text-left p-3">Ccy</th>
              <th className="text-right p-3">Invested</th>
              <th className="text-right p-3">Value</th>
              <th className="text-right p-3">Gain</th>
              <th className="text-right p-3">Return</th>
            </tr>
          </thead>

          <tbody>
            {data.map((p, i) => (
              <tr
                key={i}
                className="border-b border-white/5 hover:bg-white/5"
              >
                <td className="p-3 flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: p.color }}
                  />
                  {p.name}
                </td>

                <td className="p-3 text-[#8fa3bf]">{p.ccy}</td>

                <td className="p-3 text-right">{p.invested}</td>
                <td className="p-3 text-right">{p.value}</td>

                <td className="p-3 text-right text-[#00c896]">
                  {p.gain}
                </td>

                <td className="p-3 text-right text-[#00c896]">
                  {p.return}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}