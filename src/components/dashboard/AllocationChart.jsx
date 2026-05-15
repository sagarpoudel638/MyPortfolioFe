

export default function AllocationChart() {
  const data = [
    { label: "CommBank", value: 29, color: "#1a6bbc" },
    { label: "CommSec", value: 11, color: "#2e82d8" },
    { label: "Webull", value: 28, color: "#0ea5e9" },
    { label: "Meroshare", value: 32, color: "#00c896" },
  ];

  const total = 100;

  let offset = 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h2 className="text-xs uppercase text-[#8fa3bf] font-semibold mb-3">
        Allocation (By Value)
      </h2>

      <div className="flex flex-col items-center gap-4">

        {/* Donut */}
        <svg width="120" height="120" viewBox="0 0 120 120">
          {data.map((d, i) => {
            const circumference = 2 * Math.PI * 40;
            const stroke = (d.value / total) * circumference;
            const dash = `${stroke} ${circumference}`;

            const circle = (
              <circle
                key={i}
                cx="60"
                cy="60"
                r="40"
                fill="none"
                stroke={d.color}
                strokeWidth="12"
                strokeDasharray={dash}
                strokeDashoffset={-offset}
              />
            );

            offset += stroke;
            return circle;
          })}

          <text
            x="60"
            y="65"
            textAnchor="middle"
            className="fill-[#8fa3bf] text-xs"
          >
            AUD 1,968
          </text>
        </svg>

        {/* Legend */}
        <div className="w-full space-y-2">
          {data.map((d, i) => (
            <div key={i} className="flex items-center text-xs text-[#8fa3bf]">
              <span
                className="w-2 h-2 rounded-full mr-2"
                style={{ background: d.color }}
              />
              {d.label}
              <span className="ml-auto text-[#5d7a9a]">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}