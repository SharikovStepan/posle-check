export default function PaidCounter({ paid, total, isPending = false }: { isPending?: boolean; paid: number; total: number }) {
  const isLessThanHalf = paid < total / 2;
  const nobodyPaied = paid == 0;

  const isAllPaied = paid == total;

  const mainClassNames = "text-xs md:text-sm text-nowrap";

  return (
    <>
      {isAllPaied ? (
        <p className={`${mainClassNames} text-success`}>Все заплатили</p>
      ) : (
        <div className={`${mainClassNames} ${nobodyPaied ? "text-text-tertiary/70" : "text-warning"} relative flex gap-1`}>
          {isPending && <PendingDot className="absolute top-1/2 -left-1 -translate-y-1/2 -translate-x-full" />}
          <p className="font-medium tracking-wider">
            {paid}/{total}
          </p>
          <p>заплатили</p>
        </div>
      )}
    </>
  );
}

export function PendingDot({ className }: { className: string }) {
  return (
    <span
      className={`${className} h-2.5 w-2.5 rounded-full bg-warning animate-pulse-glow`}
      style={{
        animation:"pulseGlow 2s ease-in-out infinite",
      }}></span>
  );
}
