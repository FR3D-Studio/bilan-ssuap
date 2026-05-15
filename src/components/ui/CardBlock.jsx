export default function CardBlock({
  title,
  icon: Icon,
  children,
  tone = "blue",
}) {
  const tones = {
    blue: "border-blue-100 bg-blue-50",
    red: "border-red-100 bg-red-50",
    green: "border-green-100 bg-green-50",
    amber: "border-amber-100 bg-amber-50",
    slate: "border-slate-200 bg-white",
  };

  return (
    <div
      className={`rounded-3xl border p-4 shadow-sm ${tones[tone]}`}
    >
      <div className="mb-4 flex items-center gap-3">
        {Icon ? (
          <div className="rounded-2xl bg-white p-2 shadow-sm">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}

        <h2 className="text-lg font-black text-slate-800">
          {title}
        </h2>
      </div>

      {children}
    </div>
  );
}