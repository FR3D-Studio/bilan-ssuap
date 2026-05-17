export default function Field({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}) {
  return (
    <label className="block space-y-2">
      <span className="pl-0.5 text-sm font-bold leading-tight text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
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
          transition
          [color-scheme:light]
          placeholder:text-slate-400
          focus:border-[#0B57D0]
          focus:bg-white
          focus:ring-2
          focus:ring-blue-100
        "
      />
    </label>
  );
}
