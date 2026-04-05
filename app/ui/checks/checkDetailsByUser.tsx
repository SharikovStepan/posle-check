import { CheckDetailsByUserType } from "@/app/lib/types/types.checks";
import PaidCounter from "./paidCounter";
import CheckDetailsParticpantCard from "./checkDetailsParticpantCard";

export default function CheckDetailsByUser({ checkData }: { checkData: CheckDetailsByUserType }) {
  console.log("checkData", checkData);

  return (
    <>
      <main className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 items-center text-text-primary w-full justify-center text-2xl">
          <p className="font-light text-text-tertiary text-base tracking-wide">Сумма чека</p>
          <p className="tracking-wide relative">
            {checkData.total_amount} <span className="absolute top-0 right-0 translate-x-[calc(100%+4px)]">₽</span>
          </p>
        </div>
        <span className="block w-full bg-surface mt-6 h-0.5 "></span>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between px-2 items-center text-text-tertiary">
            <div className="flex gap-2">
              <p>Оплачено:</p>
              <p>{checkData.paid_amount} ₽</p>
            </div>

            <PaidCounter total={checkData.participants.length} paid={checkData.paid_count} />
          </div>

          <div className="flex flex-col gap-3 mb-14">
            {checkData.participants.map((p) => {
              return <CheckDetailsParticpantCard key={`${p.id}-${checkData.id}`} checkId={checkData.id} participantData={p} />;
            })}
          </div>
        </div>
      </main>
    </>
  );
}
