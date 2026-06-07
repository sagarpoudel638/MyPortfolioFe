// AllocationChart.jsx
const MARKET_COLORS = {
  ASX:    "#1a6bbc",
  NYSE:   "#2e82d8",
  NASDAQ: "#0ea5e9",
  NEPSE:  "#00c896",
};

export default function AllocationChart({ platforms }) {
  if (!platforms) return null;

  // platforms prop holds the markets object from the API
  const entries = Object.values(platforms).map((m) => ({
    label: m.name,
    value: m.summary.current,
    color: MARKET_COLORS[m.name] || "#888",
    currency: m.currency,
  }));

  // Can only show meaningful % if same currency — use as relative weights
  const total = entries.reduce((sum, e) => sum + e.value, 0);

  const data = entries.map((e) => ({
    ...e,
    percent: total > 0 ? parseFloat(((e.value / total) * 100).toFixed(1)) : 0,
  }));

  const circumference = 2 * Math.PI * 40;
  let offset = 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h2 className="text-xs uppercase text-[#8fa3bf] font-semibold mb-3">
        Allocation (By Value)
      </h2>

      <div className="flex flex-col items-center gap-4">
        <svg width="120" height="120" viewBox="0 0 120 120">
          {data.map((d, i) => {
            const stroke = (d.percent / 100) * circumference;
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
          <text x="60" y="62" textAnchor="middle" fontSize="8" fill="#8fa3bf">
            {data.length} markets
          </text>
        </svg>

        <div className="w-full space-y-2">
          {data.map((d, i) => (
            <div key={i} className="flex items-center text-xs text-[#8fa3bf]">
              <span className="w-2 h-2 rounded-full mr-2" style={{ background: d.color }} />
              {d.label}
              <span className="ml-auto text-[#5d7a9a]">{d.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}