export default function Check({
  label,
  checked,
  onChange,
  danger = false,
}) {
  const boxClass = danger
    ? "flex min-h-12 items-center gap-3 rounded-xl border border-red-700 bg-red-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-950/15"
    : "flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-white";

  return (
    <label className={boxClass}>
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 shrink-0 accent-[#003C8F]"
      />

      <span className="leading-snug">{label}</span>
    </label>
  );
}
