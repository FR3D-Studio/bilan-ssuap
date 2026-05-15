export default function Section({
  title,
  children,
}) {
  return (
    <section className="space-y-4">
      <h3 className="text-base font-black text-slate-800">
        {title}
      </h3>

      {children}
    </section>
  );
}