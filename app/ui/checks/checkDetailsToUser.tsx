"use client";

import { createPaymentAction } from "@/app/lib/actions/actions.checks";
import { CheckDetailsByUserType, SendPaymentType } from "@/app/lib/types/types.checks";
import { UserCircleIcon } from "@heroicons/react/16/solid";
import { useActionState, useEffect, useRef, useState } from "react";
import Spinner from "../spinner";
import ToggleParticipatingButton from "./toggleParticipatingButton";

export default function CheckDetailsToUser({ checkData }: { checkData: CheckDetailsByUserType }) {
  const userData = checkData.participants[0];

  const firstPayment = userData.payments.length > 0 ? userData.payments[0] : null;

  const status = firstPayment?.status || "unpaid";

  const [paymentAmount, setPaymentAmount] = useState<number>(firstPayment ? firstPayment.amount : userData.share_amount || 0);

  const [state, formAction, isPending] = useActionState<SendPaymentType, FormData>(createPaymentAction, {});

  const [showError, setShowError] = useState<boolean>(false);

  const errorShowTmr = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (errorShowTmr.current) {
      clearTimeout(errorShowTmr.current);
    }

    if (state.error) {
      setShowError(true);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      errorShowTmr.current = setTimeout(() => {
        setShowError(false);
      }, 3000);
    }

    return () => {
      if (errorShowTmr.current) {
        clearTimeout(errorShowTmr.current);
      }
    };
  }, [state]);

  const handleChangeAmount = (currentAmount: number) => {
    setPaymentAmount(currentAmount);
  };

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

        <div className="flex flex-col gap-2 mb-2">
          <p className="text-text-tertiary/80 ml-2">Создатель:</p>

          <div className={`relative p-1 rounded-2xl bg-surface h-14 flex gap-3 justify-between items-center border border-border shadow-md`}>
            <div className="h-full flex flex-col justify-between">
              <div className={` h-full flex items-center gap-3`}>
                {checkData.creator.avatar_url ? (
                  <div className={`h-12 rounded-full overflow-hidden`}>
                    <img src={checkData.creator.avatar_url} alt="user icon" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <UserCircleIcon className={`h-12 w-full text-accent/80 overflow-hidden`} />
                )}
                <p className="text-text-primary text-lg">{checkData.creator.full_name || checkData.creator.username}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-text-tertiary/80 ml-2">Ваш долг:</p>

          <form action={formAction} className="relative grid grid-cols-[1fr_1fr_1fr] px-2 py-1 rounded-xl bg-surface h-14 border border-border shadow-md">
            <div className={`flex justify-center items-center gap-2 w-full ${status == "confirmed" ? "col-[1/4]" : "col-[1/3]"}`}>
              <div className="relative h-full w-full grid grid-cols-[1fr_1fr] items-center justify-items-center">
                <label
                  htmlFor="payment-amount"
                  className={`${state.error?.payment_amount ? "text-error!" : ""} ${
                    status == "pending" ? "text-warning" : status == "confirmed" ? "text-success text-xl!" : status == "declined" ? "text-error" : "text-text-primary"
                  } block text-sm col-[1/2] `}>
                  {status == "unpaid" && userData.share_amount
                    ? "Вам указали сумму"
                    : status == "unpaid" && !userData.share_amount
                    ? "Введите сумму"
                    : status == "pending"
                    ? "Вы ожидаете подтверждения"
                    : status == "confirmed"
                    ? "Вы оплатили"
                    : "Оплата не подтвеждена"}
                </label>

                <div className="relative">
                  <input
                    ref={inputRef}
                    disabled={status == "confirmed" || status == "pending"}
                    readOnly={userData.share_amount != null}
                    type="text"
                    inputMode="decimal"
                    name="payment-amount"
                    id="payment-amount"
                    min="0"
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/\D/g, "");
                      if (onlyDigits == "0" || onlyDigits == "") {
                        handleChangeAmount(0);
                      } else {
                        handleChangeAmount(Number(onlyDigits));
                      }
                    }}
                    value={paymentAmount == 0 ? "" : paymentAmount}
                    autoComplete="off"
                    aria-invalid={!!state.error?.payment_amount}
                    className={`${showError ? "focus:ring-error!" : ""} ${
                      status == "pending" || status == "confirmed" || userData.share_amount
                        ? "bg-bg-secondary focus:outline-none focus:none px-0.5 font-bold text-lg"
                        : "bg-bg-tertiary focus sm:text-sm px-1"
                    } w-15 h-8 block rounded-lg text-end col-[2/3] justify-self-center`}
                  />

                  <p className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-[calc(100%+2px)]">₽</p>
                </div>
              </div>
            </div>
            {status != "confirmed" && (
              <button
                disabled={status == "pending" || isPending}
                className={`${status == "pending" || isPending ? "opacity-30 cursor-default!" : ""} ${
                  status == "declined" ? "text-xs!" : ""
                } px-0.5 rounded-md cursor-pointer bg-success text-text-inverted col-[3/4] h-8 w-26 justify-self-end self-center`}>
                {isPending ? <Spinner /> : status == "declined" ? "Оплатить ещё раз" : "Оплатить"}
              </button>
            )}

            <input type="hidden" name="checkId" value={checkData.id} />
          </form>
        </div>

        {/* {userData.payments} */}
        {/* <div className="w-full p-4 bg-bg-secondary mt-20 flex justify-center items-center rounded-md">
          <ToggleParticipatingButton className="cursor-pointer px-2 py-0.5 bg-error/80 text-text-secondary min-w-30" checkId={checkData.id} memberId={userData.id} participating={"false"}>
            Не участвовал в чеке
          </ToggleParticipatingButton>
        </div> */}
      </main>
    </>
  );
}
