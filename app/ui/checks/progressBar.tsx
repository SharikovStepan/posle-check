export default function ProgressBar({ total, current }: { total: number; current: number }) {
  const width = (100 / total) * current;
  const color = width < 50 ? "var(--color-error)" : width >= 50 && width != 100 ? "var(--color-warning)" : "var(--color-success)";
  return (
    <>
      <div className="relative w-full h-2 bg-bg-tertiary rounded-lg col-span-3">
        <div style={{ width: `${width}%`, backgroundColor: color }} className="absolute top-1/2 left-0 -translate-y-1/2 h-full rounded-lg"></div>
      </div>
    </>
  );
}
