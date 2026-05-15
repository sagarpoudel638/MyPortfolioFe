// src/components/ui/Chip.jsx

export default function Chip({ children, color = "blue" }) {
  const colors = {
    blue: "bg-blue-500/15 text-[#2e82d8]",
    green: "bg-[#00c896]/15 text-[#00c896]",
    red: "bg-red-500/15 text-red-500",
    amber: "bg-amber-500/15 text-amber-500",
    gray: "bg-white/10 text-[#8fa3bf]",
  };

  return (
    <span
      className={`text-[10px] px-2 py-[2px] rounded font-medium ${colors[color]}`}
    >
      {children}
    </span>
  );
}