export default function Topbar({
  title,
  actions,
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-[#162741] px-5 py-3">

      <h1 className="text-lg font-semibold">
        {title}
      </h1>

      <div className="flex items-center gap-2">
        {actions}
      </div>

    </div>
  );
}