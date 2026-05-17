export default function Badge({
  children,
  color = "slate",
  danger = false,
}) {
  const colors = {
    red: "bg-red-600 text-white shadow-red-950/20",
    green: "bg-emerald-600 text-white shadow-emerald-950/20",
    amber: "bg-amber-400 text-slate-950 shadow-amber-950/15",
    blue: "bg-[#003C8F] text-white shadow-blue-950/20",
    slate: "bg-slate-800 text-white shadow-slate-950/20",
  };

  return (
    <span
      className={`inline-flex items-center justify-center text-center rounded-full px-3 py-2 text-xs font-black leading-tight shadow-lg ${
        danger ? colors.red : colors[color]
      }`}
    >
      {children}
    </span>
  );
}
