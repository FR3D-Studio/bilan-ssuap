export default function SelectField({
  label,
  value,
  onChange,
  options,
  danger = false,
}) {
  const selectClass = danger
    ? `
      w-full
      min-h-12
      rounded-xl
      border
      border-red-300
      bg-red-50
      px-4
      py-3
      text-sm
      font-bold
      text-red-700
      outline-none
      focus:border-red-500
      focus:ring-2
      focus:ring-red-100
    `
    : `
      w-full
      min-h-12
      rounded-xl
      border
      border-slate-200
      bg-slate-50
      px-4
      py-3
      text-sm
      font-medium
      text-slate-900
      outline-none
      focus:border-[#0B57D0]
      focus:bg-white
      focus:ring-2
      focus:ring-blue-100
    `;

  return (
    <label className="block space-y-2">
      <span
        className={
          danger
            ? "pl-0.5 text-sm font-black leading-tight text-red-700"
            : "pl-0.5 text-sm font-bold leading-tight text-slate-700"
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
