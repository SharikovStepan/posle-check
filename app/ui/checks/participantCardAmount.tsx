import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useParticipantsContext } from "./participantsProvider";
import { CreateCheckParticipantsCardsType } from "@/app/lib/types/types.checks";
import ToggleButton from "../toggleButton";
import { useEffect, useState } from "react";
import { isAllAdded, maxPossibeParticipantValue } from "./utils";

export default function ParticipantCardAmount({ participantData }: { participantData: CreateCheckParticipantsCardsType }) {
  const { state, dispatch } = useParticipantsContext();

  //   const [isCustomAmount, setIsCustomAmount] = useState<boolean>(!!participantData.amount);
  //   const [amount, setAmount] = useState(0);

  const toggleCustomAmount = () => {
    if (participantData.amount <= 0) {
      dispatch({ type: "SET_AMOUNT", payload: { id: participantData.id, amount: 0.9 } });
    } else {
      dispatch({ type: "CLEAR_AMOUNT", payload: { id: participantData.id } });
    }
  };

  const handleChange = (currentAmount: number) => {
    const maxValue = maxPossibeParticipantValue(state.total, state.participanstList, state.creator, participantData.id);
    if ((state.creator.amount < 1 || !state.creator.participating) && currentAmount > maxValue) {
      dispatch({ type: "SET_AMOUNT", payload: { id: participantData.id, amount: maxValue } });
    } else {
      dispatch({ type: "SET_AMOUNT", payload: { id: participantData.id, amount: currentAmount } });
    }

    //  setAmount(currentAmount);
  };

  useEffect(() => {
    //  dispatch({ type: "SET_AMOUNT", payload: { id: participantData.id, amount } });
    //  setAmount(amount);
  }, []);

  //   useEffect(() => {
  //     if (isCustomAmount) {
  //       // dispatch({ type: "SET_AMOUNT", payload: { id: participantData.id, amount } });
  //       setAmount(amount);
  //     } else {
  //       dispatch({ type: "CLEAR_AMOUNT", payload: { id: participantData.id } });
  //       setAmount(0);
  //     }
  //   }, [isCustomAmount]);

  //   useEffect(() => {
  //     switch (state.lastDispatch) {
  //       case "SHARE_AMOUNT":
  //         setIsCustomAmount(true);
  //         if (state.participanstList[0].amount) {
  //           setAmount(state.participanstList[0].amount);
  //         }
  //         break;
  //       case "CANCEL_SHARE":
  //         setIsCustomAmount(false);
  //         setAmount(0);

  //       default:
  //         break;
  //     }
  //   }, [state.lastDispatch]);

  return (
    <div className={`overflow-hidden relative p-2 rounded-2xl bg-surface h-20 flex gap-3 justify-between items-center transition-all duration-200 border border-border shadow-md`}>
      <div className="h-full grid grid-cols-[auto_1fr_80_auto] gap-x-1 w-full">
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
          <p className={`${!!participantData.amount ? "text-success" : "text-warning"} opacity-80 text-xs justify-self-end`}>{!!participantData.amount ? "Вы ввели сумму" : "Выберет сумму сам"}</p>
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
            <label htmlFor="title" className="block text-sm text-text-primary">
              Сумма Р
            </label>
            <div className="flex justify-center items-center">
              <input
                // ref={inputNameRef}
                disabled={!participantData.amount}
                type="number"
                name="amount"
                min="0"
                id="amount"
                onChange={(e) => {
                  if (e.target.value.startsWith("-") || e.target.value == "0") {
                    handleChange(0.9);
                  } else {
                    handleChange(Number(e.target.value));
                  }
                }}
                value={participantData.amount < 1 ? "" : participantData.amount}
                autoComplete="off"
                // aria-invalid={!!state.errors?.title}
                // aria-describedby={state.errors?.title ? "title-error" : undefined}
                className={` block w-20 h-8 bg-bg-tertiary rounded-lg justify-self-end shadow-sm sm:text-sm px-3 text-end focus ${false ? "focus:ring-error!" : ""}`}
              />
              {/* <p className="absolute top-1/2 right-0 translate-y-[calc(50%-4px)] translate-x-[calc(100%+4px)]">Р</p> */}
            </div>
          </div>
        </div>

        <label className=" inline-flex w-fit h-full items-center justify-between">
          <span className="select-none hidden text-lg font-medium text-text-primary">{"Ввести сумму"}</span>
          <input name={"isCustomAmount"} type="checkbox" checked={!!participantData.amount} onChange={toggleCustomAmount} className="sr-only peer" />
          <div className="cursor-pointer relative w-8 h-16 bg-bg-tertiary peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-(--ring) rounded-full peer peer-checked:after:-translate-y-full rtl:peer-checked:after:-translate-y-full peer-checked:after:border-border after:content-[''] after:absolute after:bottom-0 after:border-border after:border-2 after:bg-text-primary after:rounded-full after:h-8 after:w-8 after:transition-all transition-all peer-checked:bg-accent/70"></div>
        </label>
        {/* <ToggleButton toggleState={isCustomAmount} toggleChange={setIsCustomAmount} inputName="set-amount" labelText="Введите сумму" /> */}
      </div>
    </div>
  );
}
