export default function Modal({
  open,
  title,
  children,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-2 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[94vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white p-4 shadow-2xl shadow-slate-950/30 sm:p-6">
        <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-4 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:-mt-6 sm:px-6">
          <h2 className="text-lg font-black text-slate-950 sm:text-xl">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="min-h-10 rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold hover:bg-slate-200"
          >
            Fermer
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
