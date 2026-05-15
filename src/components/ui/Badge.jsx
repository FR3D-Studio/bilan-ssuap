export default function Badge({
  children,
  color = "slate",
}) {
  const colors = {
    red: "bg-red-600 text-white",
    green: "bg-green-600 text-white",
    amber: "bg-amber-500 text-black",
    blue: "bg-blue-600 text-white",
    slate: "bg-slate-700 text-white",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${colors[color]}`}
    >
      {children}
    </span>
  );
}