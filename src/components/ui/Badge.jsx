

export default function Badge({
  children,
  color = "red",
}) {
  const colors = {
    red: "bg-red-500 text-white",
    green: "bg-[#00c896] text-white",
    blue: "bg-[#2e82d8] text-white",
    gray: "bg-white/10 text-[#8fa3bf]",
  };

  return (
    <span
      className={`text-[10px] px-2 py-[1px] rounded-full font-semibold ${colors[color]}`}
    >
      {children}
    </span>
  );
}