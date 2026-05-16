export default function ScoreCard({
  title,
  value,
  danger = false,
  children,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-base font-bold text-slate-900">
        {title}
      </h3>

      {children}

      <div
        className={`mt-3 rounded-2xl p-3 text-center text-2xl font-black text-white ${
          danger ? "bg-red-600" : "bg-slate-950"
        }`}
      >
        {value}
      </div>
    </div>
  );
}