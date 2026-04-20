"use client";
import { CheckDetailsByUserType } from "@/app/lib/types/types.checks";
import PaidCounter from "./paidCounter";
import CheckDetailsParticpantCard from "./checkDetailsParticpantCard";
import { motion } from "motion/react";

export default function CheckDetailsByUser({ checkData }: { checkData: CheckDetailsByUserType }) {
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

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
          <div className="flex justify-between px-2 items-center text-text-tertiary">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <p>Оплачено:</p>
                <p>{checkData.paid_amount} ₽</p>
              </div>
              {checkData.creator.participating && (
                <div className="flex gap-2 text-text-tertiary/80">
                  <p>Моя часть:</p>
                  <p>{checkData.creator.amount} ₽</p>
                </div>
              )}
            </div>

            <PaidCounter total={checkData.participants.length} paid={checkData.paid_count} />
          </div>

          <div className="will-change-transform flex flex-col gap-3 mb-14">
            {checkData.participants.map((p) => {
              return <CheckDetailsParticpantCard key={`${p.id}-${checkData.id}`} checkId={checkData.id} participantData={p} />;
            })}
          </div>
        </motion.div>
      </main>
    </>
  );
}
