// src/components/watchlist/InfoBox.jsx

export default function InfoBox({
  icon,
  text,
  color = "emerald",
}) {
  return (
    <div
      className={`mt-5 rounded-xl border p-4 text-xs
      ${
        color === "red"
          ? "border-red-500/20 bg-red-500/5 text-red-400"
          : "border-emerald-500/20 bg-emerald-500/5 text-slate-400"
      }`}
    >
      <div className="flex items-start gap-2">
        <i className={`${icon} text-sm`}></i>

        <p>{text}</p>
      </div>
    </div>
  );
}