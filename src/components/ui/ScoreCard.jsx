import { ChevronDown } from "lucide-react";

export default function ScoreCard({
  title,
  value,
  danger = false,
  children,
  collapsible = false,
  defaultOpen = false,
}) {
  const valueClass = danger
    ? "bg-red-600 shadow-red-950/20"
    : "bg-[#071D49] shadow-blue-950/15";

  if (collapsible) {
    return (
      <details
        open={defaultOpen}
        className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-950/5"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
          <h3 className="text-base font-black text-slate-950">{title}</h3>

          <div className="flex items-center gap-2">
            <div
              className={`rounded-xl px-3 py-2 text-sm font-black text-white shadow-lg ${valueClass}`}
            >
              {value}
            </div>
            <ChevronDown className="h-5 w-5 text-slate-500 transition group-open:rotate-180" />
          </div>
        </summary>

        <div className="mt-4">{children}</div>
      </details>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-950/5">
      <h3 className="mb-3 text-base font-black text-slate-950">
        {title}
      </h3>

      {children}

      <div
        className={`mt-3 rounded-xl p-3 text-center text-xl font-black text-white shadow-lg sm:text-2xl ${
          valueClass
        }`}
      >
        {value}
      </div>
    </div>
  );
}
