export default function Button({
  children,
  onClick,
  variant = "solid",
  type = "button",
}) {
  const base =
    "inline-flex min-h-12 items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition active:scale-[0.99] disabled:opacity-50";

  const styles =
    variant === "outline"
      ? `${base} border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50`
      : `${base} bg-[#003C8F] text-white shadow-lg shadow-blue-950/15 hover:bg-[#002B67]`;

  return (
    <button
      type={type}
      onClick={onClick}
      className={styles}
    >
      {children}
    </button>
  );
}
