

export default function KpiCard({ title, value, sub, icon, accent, loss }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        loss
          ? "border-red-500/30 bg-red-500/10"
          : accent
          ? "border-[#00c896]/30 bg-[#00c896]/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      <div className="flex items-center gap-2 text-xs uppercase text-[#8fa3bf] mb-2">
        {icon}
        {title}
      </div>

      <div className="text-3xl font-semibold">{value}</div>

      <p className="text-xs text-[#5d7a9a] mt-1">{sub}</p>
    </div>
  );
}