export default function Field({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
    </label>
  );
}