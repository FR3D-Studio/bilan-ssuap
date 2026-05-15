export default function Button({
  children,
  onClick,
  variant = "solid",
}) {
  const styles =
    variant === "outline"
      ? "rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
      : "rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800";

  return (
    <button
      onClick={onClick}
      className={styles}
    >
      {children}
    </button>
  );
}