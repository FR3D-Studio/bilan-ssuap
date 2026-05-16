export default function Modal({
  open,
  title,
  children,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-bold hover:bg-slate-200"
          >
            Fermer
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}