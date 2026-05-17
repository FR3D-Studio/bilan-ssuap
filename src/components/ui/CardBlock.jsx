export default function CardBlock({
  title,
  icon: Icon,
  children,
  tone = "blue",
}) {
  const tones = {
    blue: {
      shell: "border-blue-100 bg-white shadow-blue-950/5",
      icon: "bg-blue-50 text-[#003C8F] ring-blue-100",
      accent: "from-[#003C8F] to-[#0B57D0]",
    },
    red: {
      shell: "border-red-100 bg-white shadow-red-950/5",
      icon: "bg-red-50 text-red-700 ring-red-100",
      accent: "from-red-600 to-red-500",
    },
    green: {
      shell: "border-emerald-100 bg-white shadow-emerald-950/5",
      icon: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      accent: "from-emerald-600 to-emerald-500",
    },
    amber: {
      shell: "border-amber-100 bg-white shadow-amber-950/5",
      icon: "bg-amber-50 text-amber-700 ring-amber-100",
      accent: "from-amber-500 to-orange-500",
    },
    slate: {
      shell: "border-slate-200 bg-white shadow-slate-950/5",
      icon: "bg-slate-100 text-slate-700 ring-slate-200",
      accent: "from-slate-500 to-slate-700",
    },
  };
  const currentTone = tones[tone] ?? tones.blue;

  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-2xl
        border
        p-4
        shadow-lg
        sm:p-5
        ${currentTone.shell}
      `}
    >
      <div
        className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${currentTone.accent}`}
      />

      <div className="mb-4 flex items-center gap-3">
        {Icon ? (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${currentTone.icon}`}
          >
            <Icon className="h-5 w-5" strokeWidth={2.35} />
          </div>
        ) : null}

        <h2 className="text-base font-black leading-tight text-slate-950 sm:text-lg">
          {title}
        </h2>
      </div>

      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
