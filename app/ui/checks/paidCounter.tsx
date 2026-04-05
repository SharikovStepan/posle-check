export default function PaidCounter({ paid, total }: { paid: number; total: number }) {
  const isLessThanHalf = paid < total / 2;
  const nobodyPaied = paid == 0;

  const isAllPaied = paid == total;

  const mainClassNames = "text-sm";

  return (
    <>
      {isAllPaied ? (
        <p className={`${mainClassNames} text-success`}>Все заплатили</p>
      ) : (
        <div className={`${mainClassNames} ${nobodyPaied ? "text-text-tertiary/70" : "text-warning"} flex gap-1`}>
          <p className="font-medium tracking-wider">
            {paid}/{total}
          </p>
          <p>заплатили</p>
        </div>
      )}
    </>
  );
}
