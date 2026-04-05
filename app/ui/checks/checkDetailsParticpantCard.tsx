"use client";

import { CheckDetailsParticipant } from "@/app/lib/types/types.checks";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { ConfirmPaymentButton } from "./confirmPaymentButton";

function transformString(str: string): string {
  const words = str.trim().split(/\s+/); // Разбиваем на слова по пробелам

  if (words.length < 2) {
    return str; // Если меньше 2 слов, возвращаем как есть
  }

  const firstWord = words[0];
  const secondWord = words[1];
  const firstLetterOfSecond = secondWord.charAt(0).toUpperCase();

  return `${firstWord} ${firstLetterOfSecond}.`;
}

export default function CheckDetailsParticpantCard({ participantData, checkId }: { participantData: CheckDetailsParticipant; checkId: string }) {
  const firstPayment = participantData.payments.length > 0 ? participantData.payments[0] : null;

  const status = firstPayment?.status || "unpaid";

  const name = participantData.full_name ? transformString(participantData.full_name) : participantData.username;

  const amountToShow = firstPayment && (status == "confirmed" || status == "pending") ? firstPayment.amount : participantData.share_amount;

  return (
    <div
      className={`${
        status == "pending" ? "border border-warning" : status == "unpaid" ? "opacity-70 border border-surface-hover" : ""
      } relative px-1 py-1 rounded-2xl bg-surface h-20 flex gap-3 justify-between items-center border border-border shadow-md`}>
      <div className="h-full w-full flex justify-between">
        <div className={`h-full flex items-center gap-3`}>
          {participantData.avatar_url ? (
            <div className={`h-12 rounded-full overflow-hidden`}>
              <img src={participantData.avatar_url} alt="group icon" className="w-full h-full object-cover" />
            </div>
          ) : (
            <UserCircleIcon className={`h-12 text-accent/80 overflow-hidden`} />
          )}
          <div className=" max-w-28 grid grid-rows-[1fr_1fr] h-full items-center">
            <p className="text-text-primary text-base">{name}</p>
            <p className={`${status == "confirmed" ? "text-success" : status == "pending" ? "text-warning" : "text-error/80"} text-xs`}>
              {status == "confirmed" ? "Оплатил" : status == "pending" ? "Подтвердите оплату" : status == "declined" ? "Отклонено" : "Не оплатил"}
            </p>
          </div>
        </div>

        <div className="relative w-23 grid grid-rows-[1fr_1fr] h-full items-center justify-items-center">
          {amountToShow && (
            <p className={`${status != "pending" ? "row-[1/3]" : ""} ${status == "unpaid" ? "text-error/80" : ""} relative text-lg font-medium mr-2`}>
              {amountToShow}
              <span className="absolute top-0 right-0 translate-x-[calc(100%+4px)]">₽</span>
            </p>
          )}
          {status == "pending" ? (
            <div className="relative flex gap-1 justify-center">
              <div className="absolute top-0 left-0 -translate-x-[calc(100%+4px)]">
                <ConfirmPaymentButton action="decline" checkId={checkId} paymentId={firstPayment?.id || ""} />
              </div>

              <ConfirmPaymentButton action="confirm" checkId={checkId} paymentId={firstPayment?.id || ""} />

              {/* <button type="button" className="p-1 rounded-md cursor-pointer bg-success text-xs text-text-inverted">
                Подтвердить
              </button> */}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
