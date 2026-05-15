export default function SelectField({
  label,
  value,
  onChange,
  options,
  danger = false,
}) {
  const selectClass = danger
    ? "w-full rounded-2xl border border-red-700 bg-red-600 px-3 py-2 text-sm font-bold text-white shadow-sm outline-none transition"
    : "w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

  return (
    <label className="block space-y-1">
      <span
        className={
          danger
            ? "text-sm font-black text-red-700"
            : "text-sm font-medium text-slate-700"
        }
      >
        {label}
      </span>

      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
      >
        <option value="">Sélectionner...</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}