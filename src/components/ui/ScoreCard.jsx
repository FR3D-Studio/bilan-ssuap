export default function ScoreCard({
  title,
  value,
  danger = false,
  children,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-950/5">
      <h3 className="mb-3 text-base font-black text-slate-950">
        {title}
      </h3>

      {children}

      <div
        className={`mt-3 rounded-xl p-3 text-center text-xl font-black text-white shadow-lg sm:text-2xl ${
          danger
            ? "bg-red-600 shadow-red-950/20"
            : "bg-[#071D49] shadow-blue-950/15"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
