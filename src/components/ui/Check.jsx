export default function Check({
  label,
  checked,
  onChange,
  danger = false,
}) {
  const boxClass = danger
    ? "flex items-center gap-3 rounded-2xl border border-red-700 bg-red-600 p-3 text-sm font-black text-white shadow-sm"
    : "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-sm";

  return (
    <label className={boxClass}>
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 accent-blue-600"
      />

      <span>{label}</span>
    </label>
  );
}