import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useParticipantsContext } from "./participantsProvider";
import { CreateCheckParticipantsCardsType } from "@/app/lib/types/types.checks";
import { useEffect, useRef, useState } from "react";
import ErrorPop from "../error-pop";
import { isEmptyParticipantsAmounts, isNotCustomParticipantsAmounts, maxPossibeAmountValue } from "./utils";

type errors = {
  isCustomAmount?: string | null;
  amount?: string | null;
};

export default function ParticipantCardAmount({ participantData }: { participantData: CreateCheckParticipantsCardsType }) {
  const { state, remindAmount, dispatch } = useParticipantsContext();

  const [cardLocalError, setCardError] = useState<errors>({});
  const showErrorTmrRef = useRef<NodeJS.Timeout | null>(null);

  const toggleCustomAmount = () => {
    if (state.total == 0) {
      setCardError((prev) => ({ ...prev, isCustomAmount: "Введите сумму чека" }));
    } else if (state.creator.participating && state.creator.amount < 1) {
      setCardError((prev) => ({ ...prev, isCustomAmount: "Введите вашу часть суммы" }));
    } else if (participantData.amount <= 0 && isEmptyParticipantsAmounts(state.participanstList) >= 1) {
      setCardError((prev) => ({ ...prev, isCustomAmount: "Заполните пустое значение другого участника" }));
    } else if (participantData.amount < 1 && participantData.amount != 0.1 && isNotCustomParticipantsAmounts(state.participanstList) == 1) {
      dispatch({ type: "SET_AMOUNT", payload: { id: participantData.id, amount: remindAmount } });
    } else if (participantData.amount > 0) {
      dispatch({ type: "CLEAR_AMOUNT", payload: { id: participantData.id } });
    } else {
      dispatch({ type: "SET_AMOUNT", payload: { id: participantData.id, amount: 0.1 } });
    }
  };

  //     if (participantData.amount <= 0 && state.total != 0 && isEmptyParticipantsAmounts(state.participanstList) == 0) {
  //     } else if (state.total == 0) {
  //     } else if (participantData.amount <= 0 && isEmptyParticipantsAmounts(state.participanstList) >= 1) {

  //     } else {

  //   };

  const handleChange = (currentAmount: number) => {
    const prevAmount = participantData.amount;
    const maxAllowed = prevAmount + remindAmount - isNotCustomParticipantsAmounts(state.participanstList);
    if (currentAmount <= maxAllowed) {
      dispatch({ type: "SET_AMOUNT", payload: { id: participantData.id, amount: currentAmount } });
    } else {
      const maxValue = maxPossibeAmountValue(state.total, state.participanstList, state.creator, participantData.id) - state.tips;

      dispatch({ type: "SET_AMOUNT", payload: { id: participantData.id, amount: maxValue } });
    }
  };

  useEffect(() => {
    if (showErrorTmrRef.current) {
      clearTimeout(showErrorTmrRef.current);
    }

    if (Object.keys(cardLocalError).length) {
      showErrorTmrRef.current = setTimeout(() => {
        setCardError({});
      }, 3000);
    }

    return () => {
      if (showErrorTmrRef.current) {
        clearTimeout(showErrorTmrRef.current);
      }
    };
  }, [cardLocalError]);
  return (
    <div className={`overflow-hidden relative p-2 rounded-2xl bg-surface h-20 flex gap-3 justify-between items-center transition-all duration-200 border border-border shadow-md`}>
      <div className="h-full grid grid-cols-[auto_1fr_80_auto] gap-x-1 w-full">
        <input type="hidden" readOnly name="participant" value={participantData.id} />
        <div className={`h-full flex items-center gap-3`}>
          {participantData.avatar_url ? (
            <div className={`h-12 rounded-full overflow-hidden`}>
              <img src={participantData.avatar_url} alt="group icon" className="w-full h-full object-cover" />
            </div>
          ) : (
            <UserCircleIcon className={`h-12 w-full text-accent/80 overflow-hidden`} />
          )}
        </div>

        <div className="flex flex-col justify-between items-start h-full">
          <p className=" text-text-primary text-sm text-ellipsis ">{participantData.full_name || participantData.username}</p>
          <p
            className={`${
              participantData.amount > 0 && participantData.amount < 1 ? "text-error text-shadow-2xs" : participantData.amount >= 1 ? "text-success	" : "text-warning"
            } opacity-80 text-xs justify-self-end`}>
            {participantData.amount > 0 && participantData.amount < 1 ? "Введите сумму" : participantData.amount >= 1 ? "Вы ввели сумму" : "Выберет сумму сам"}
          </p>
        </div>

        <div className="relative h-full w-20">
          <p
            className={`absolute h-full w-full top-0 text-center flex justify-center items-center text-sm transition-all duration-300 ${
              !!participantData.amount ? "-translate-y-[calc(100%+10px)]" : "translate-y-0"
            }`}>
            Ввести сумму
          </p>

          <div
            className={`absolute top-0 w-20 h-full flex flex-col justify-between items-center gap-1 transition-all duration-300 ${
              !!participantData.amount ? "translate-y-0" : "translate-y-[calc(100%+10px)]"
            }`}>
            <label htmlFor={`participant-${participantData.username}-amount`} className="block text-sm text-text-primary">
              Сумма Р
            </label>
            <div className="flex justify-center items-center">
              <input
                // ref={inputNameRef}
                disabled={!participantData.amount}
                type="text"
                inputMode="decimal" // мобильная клавиатура с цифрами
                name={`participant-${participantData.username}-amount`}
                min="0"
                id={`participant-${participantData.username}-amount`}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, "");

                  if (onlyDigits == "0" || onlyDigits == "") {
                    handleChange(0.1);
                  } else {
                    handleChange(Number(onlyDigits));
                  }
                }}
                value={participantData.amount < 1 ? "" : participantData.amount}
                autoComplete="off"
                // aria-invalid={!!state.errors?.title}
                aria-describedby={cardLocalError.amount ? `participant-${participantData.username}-amount-error` : undefined}
                className={` block w-20 h-8 bg-bg-tertiary rounded-lg justify-self-end shadow-sm sm:text-sm px-3 text-end focus ${false ? "focus:ring-error!" : ""}`}
              />
            </div>
            {cardLocalError.amount && (
              <div
                id={`participant-${participantData.username}-amount-error`}
                role="alert"
                className={`absolute top-1/2 left-1/2 ml-2 h-3/4 -translate-1/2 z-50 flex justify-center w-2/3 items-center text-center bg-error text-text-primary px-3 py-2 rounded-lg shadow-[0px_0px_20px_#000] transition-all`}>
                {cardLocalError.amount}
              </div>
            )}
          </div>
        </div>

        <label htmlFor={`is-custom-amount-for-${participantData.username}`} className="inline-flex w-fit h-full items-center justify-between">
          <span className="select-none hidden text-lg font-medium text-text-primary">{"Ввести сумму"}</span>
          <input
            aria-describedby={cardLocalError.isCustomAmount ? `is-custom-amount-for-${participantData.username}-error` : undefined}
            name={`is-custom-amount-for-${participantData.username}`}
            id={`is-custom-amount-for-${participantData.username}`}
            type="checkbox"
            checked={!!participantData.amount}
            onChange={toggleCustomAmount}
            className="sr-only peer"
          />
          <div className="cursor-pointer relative w-8 h-16 bg-bg-tertiary peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-(--ring) rounded-full peer peer-checked:after:-translate-y-full rtl:peer-checked:after:-translate-y-full peer-checked:after:border-border after:content-[''] after:absolute after:bottom-0 after:border-border after:border-2 after:bg-text-primary after:rounded-full after:h-8 after:w-8 after:transition-all transition-all peer-checked:bg-accent/70"></div>

          {cardLocalError.isCustomAmount && (
            <div
              id={`is-custom-amount-for-${participantData.username}-error`}
              role="alert"
              className={`absolute top-1/2 left-1/2 ml-2 h-3/4 -translate-1/2 z-50 flex justify-center w-2/3 items-center text-center bg-error text-text-primary px-3 py-2 rounded-lg shadow-[0px_0px_20px_#000] transition-all`}>
              {cardLocalError.isCustomAmount}
            </div>
          )}
        </label>
      </div>
    </div>
  );
}
