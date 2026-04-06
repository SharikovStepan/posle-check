"use client";

import { confirmPayment } from "@/app/lib/actions/actions.checks";
import { ConfirmPaymentType } from "@/app/lib/types/types.checks";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { useActionState } from "react";
import Spinner from "../spinner";

export function ConfirmPaymentButton({ paymentId, checkId, action }: { paymentId: string; checkId: string; action: "confirm" | "decline" }) {
  const [state, formAction, isPending] = useActionState<ConfirmPaymentType, FormData>(confirmPayment, {});

  return (
    <form action={formAction}>
      <input type="hidden" name="payment-id" value={paymentId} />
      <input type="hidden" name="action" value={action} />
      <input type="hidden" name="check-id" value={checkId} />

      <button
        disabled={isPending}
        type="submit"
        className={`${isPending ? "opacity-40" : ""} ${action == "confirm" ? "bg-success text-text-inverted w-20" : " bg-error flex justify-center items-center w-8"} p-0.5 rounded-md cursor-pointer text-xs h-8`}>
        {isPending ? <Spinner /> : action == "confirm" ? "Подтвердить" : <XMarkIcon className="h-4 w-4" />}
      </button>

      {/* <button type="button" className="p-1 rounded-md cursor-pointer bg-success text-xs text-text-inverted">
        Подтвердить
      </button> */}
    </form>
  );
}
