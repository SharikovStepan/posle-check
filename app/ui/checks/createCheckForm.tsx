"use client";

import { PROFILE_UUID } from "@/app/lib/placeholders-data";
import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import Spinner from "../spinner";
import ToggleButton from "../toggleButton";
import Search from "../search";
import { CreateCheckActionData, CreateCheckPageTabs, CreateCheckParticipantsCardsType } from "@/app/lib/types/types.checks";
import { FilterButton } from "@/app/lib/types/types.filters";
import TabChangeButton from "../tabChangeButtons";
import MembersList from "./membersList";
import { useParticipantsContext } from "./participantsProvider";
import ParticipantsList from "./participantsList";
import { isAllAdded, isAllParticipantsCustomAmounts, isEqualParticipantsAmounts, isNotCustomParticipantsAmounts, maxPossibeAmountValue, maxPossibleCreatorValue, sumParticipantsAmount } from "./utils";
import { createCheckAction } from "@/app/lib/actions/actions.checks";
import ErrorPop from "../error-pop";
import ConfirmCreate from "./confirmCreate";

const tabs: FilterButton<CreateCheckPageTabs>[] = [
  { filterType: "members", text: "Участники" },
  { filterType: "amounts", text: "Суммы" },
];

type LocalErrors = {
  shareMember?: string | null;
  shareAmount?: string | null;
  title?: string | null;
  totalAmount?: string | null;
  myShare?: string | null;
  participants?: string | null;
  participantAmount?: string | null;
  remindAmount?: string | null;

  succes?: string | null;
};

export default function CreateCheckForm({ groupId }: { groupId: string }) {
  const { state: contextstate, dispatch, remindAmount } = useParticipantsContext();

  const [tabType, setTabType] = useState<CreateCheckPageTabs>("amounts");

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [isAddAll, setIsAddAll] = useState<boolean>(true);
  const [shareAmount, setShareAmount] = useState<boolean>(false);

  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);

  const [localErrors, setLocalErrors] = useState<LocalErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const inputTitleRef = useRef<HTMLInputElement | null>(null);
  const inputTotalAmountRef = useRef<HTMLInputElement | null>(null);
  const inputMyShareRef = useRef<HTMLInputElement | null>(null);
  const membersListhRef = useRef<HTMLDivElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const showErrorTmr = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    switch (contextstate.lastDispatch.type) {
      case "DELETE_FROM_PARTICIPANTS":
        setIsAddAll(false);
        setShareAmount(false);
        break;
      case "ADD_TO_PARTICIPANTS":
        const notAll = contextstate.participanstList.find((member) => !member.participating);
        if (!notAll && contextstate.creator.participating) {
          setIsAddAll(true);
        }
        setShareAmount(false);
        break;
      case "CLEAR_AMOUNT":
        setShareAmount(false);
        break;
      default:
        break;
    }

    //  console.log("contextstate.lastDispatch", contextstate.lastDispatch);
  }, [contextstate.lastDispatch]);

  useEffect(() => {
    if (contextstate.lastDispatch.type == "SET_AMOUNT") {
      if (isEqualParticipantsAmounts(contextstate.participanstList)) {
        setShareAmount(true);
      } else {
        setShareAmount(false);
      }

      // if (false) {
      //   const lastParticipantUpdated = contextstate.participanstList.find((member) => member.id == contextstate.lastDispatch.id);

      //   if (lastParticipantUpdated) {
      //     const currentParticipantAmount = lastParticipantUpdated.amount;
      //     const positiveRemind = (contextstate.participanstList.length - remindAmount) * -1;

      //     dispatch({ type: "SET_AMOUNT", payload: { id: lastParticipantUpdated.id, amount: currentParticipantAmount - positiveRemind } });
      //   }
      // }

      // if (isAllParticipantsCustomAmounts(contextstate.participanstList) && contextstate.creator.participating && !isEqualParticipantsAmounts(contextstate.participanstList)) {
      //   const newValueForMyShare = contextstate.total - sumParticipantsAmount(contextstate.participanstList);

      //   dispatch({ type: "SET_AMOUNT_CREATOR", payload: { amount: newValueForMyShare } });
      // }
    }

    //  console.log("contextstate.participanstList", contextstate.participanstList);
    //   console.log("contextstate.lastDispatch.type", contextstate.lastDispatch.type);
    //   console.log("creator", contextstate.creator);
  }, [contextstate.participanstList]);

  useEffect(() => {
    if (contextstate.creator.participating) {
      if (contextstate.creator.amount >= 0 && contextstate.creator.amount < 1 && contextstate.lastDispatch.type != "CANCEL_SHARE") {
        //   setShareAmount(false);
        //  dispatch({ type: "CANCEL_SHARE" });
      }
    }
  }, [contextstate.creator]);

  useEffect(() => {
    if (isAddAll) {
      dispatch({ type: "ADD_ALL" });
    } else if (!isAddAll && contextstate.lastDispatch.type != "DELETE_FROM_PARTICIPANTS") {
      dispatch({ type: "DELETE_ALL" });
      setShareAmount(false);
    }
  }, [isAddAll]);

  useEffect(() => {
    if (shareAmount) {
      const participatedCount = contextstate.participanstList.filter((member) => member.participating).length;

      if (contextstate.creator.participating) {
        if (contextstate.creator.amount) {
          const shareAmountValue = (contextstate.total - contextstate.creator.amount) / participatedCount;
          dispatch({ type: "SHARE_AMOUNT", payload: { amount: shareAmountValue } });
        } else {
          const shareAmountValue = contextstate.total / (participatedCount + 1);
          dispatch({ type: "SHARE_AMOUNT", payload: { amount: shareAmountValue } });
          dispatch({ type: "SET_AMOUNT_CREATOR", payload: { amount: shareAmountValue } });
        }
      } else {
        const shareAmountValue = contextstate.total / participatedCount;
        dispatch({ type: "SHARE_AMOUNT", payload: { amount: shareAmountValue } });
      }
    } else if (!shareAmount && contextstate.lastDispatch.type != "CLEAR_AMOUNT" && contextstate.lastDispatch.type != "SET_AMOUNT") {
      dispatch({ type: "CANCEL_SHARE" });
    }
  }, [shareAmount]);

  const handleChangeMyShare = (currentValue: number) => {
    if (!contextstate.creator.participating) return;

    const prevAmount = contextstate.creator.amount;
    const maxAllowed = prevAmount + remindAmount - isNotCustomParticipantsAmounts(contextstate.participanstList);

    if (currentValue <= maxAllowed) {
      dispatch({ type: "SET_AMOUNT_CREATOR", payload: { amount: currentValue } });
    } else {
      const maxValue = maxPossibeAmountValue(contextstate.total, contextstate.participanstList);
      dispatch({ type: "SET_AMOUNT_CREATOR", payload: { amount: maxValue } });
    }
  };

  const handleChangeAmount = (currentValue: number) => {
    dispatch({ type: "SET_TOTAL", payload: { amount: currentValue } });

    if (shareAmount) {
      setShareAmount(false);
    }
  };

  const handleToggleAddAll = () => {
    setIsAddAll((prev) => {
      setShareAmount(false);
      return !prev;
    });
  };

  const handleToggleShare = () => {
    const participatedCount = contextstate.participanstList.filter((member) => member.participating).length;
    const possibleToShare = contextstate.total / participatedCount >= 1 && participatedCount >= 1;

    if (possibleToShare && !shareAmount) {
      setShareAmount(true);
    } else if (shareAmount) {
      setShareAmount(false);
    } else if (!participatedCount) {
      setLocalErrors((prev) => ({ ...prev, shareMember: "Добавьте участников" }));
    } else {
      setLocalErrors((prev) => ({ ...prev, shareAmount: "Сумма должна быть больше количества участников" }));
    }
  };

  useEffect(() => {
    if (showErrorTmr.current) {
      clearTimeout(showErrorTmr.current);
    }

    if (localErrors.title) {
      if (inputTitleRef.current) {
        inputTitleRef.current.focus();
      }
    }

    if (localErrors.totalAmount) {
      if (inputTotalAmountRef.current) {
        inputTotalAmountRef.current.focus();
      }
    }

    if (localErrors.shareAmount) {
      if (inputTotalAmountRef.current) {
        inputTotalAmountRef.current.focus();
      }
    }

    if (localErrors.myShare) {
      if (inputMyShareRef.current) {
        inputMyShareRef.current.focus();
      }
    }

    if (localErrors.participants) {
      setTabType("members");
      if (membersListhRef.current && !membersListhRef.current.classList.contains("hidden")) {
        membersListhRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start", // 'start', 'center', 'end', 'nearest'
          inline: "nearest",
        });
      } else if (tabsRef.current) {

        tabsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start", // 'start', 'center', 'end', 'nearest'
          inline: "nearest",
        });
      }
    }

    if (Object.keys(localErrors).length) {
      showErrorTmr.current = setTimeout(() => {
        setLocalErrors({});
      }, 3000);
    }


    return () => {
      if (showErrorTmr.current) {
        clearTimeout(showErrorTmr.current);
      }
    };
  }, [localErrors]);

  const onSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title == "") {
      setLocalErrors((prev) => ({ ...prev, title: "Название не может быть пустым" }));
      return;
    }

    if (contextstate.total == 0) {
      setLocalErrors((prev) => ({ ...prev, totalAmount: "Введите сумму чека" }));
      return;
    }

    if (contextstate.creator.participating && contextstate.creator.amount == 0) {
      setLocalErrors((prev) => ({ ...prev, myShare: "Введите свою часть суммы" }));
      return;
    }

    if (!contextstate.participanstList.find((member) => member.participating)) {
      setLocalErrors((prev) => ({ ...prev, participants: "Добавьте участников" }));
      return;
    }

    if (contextstate.participanstList.find((member) => member.participating && member.amount == 0.1)) {
      setLocalErrors((prev) => ({ ...prev, participantAmount: "Введите сумму участника" }));
      return;
    }

    if (remindAmount > 1 && isAllParticipantsCustomAmounts(contextstate.participanstList)) {
      setLocalErrors((prev) => ({ ...prev, remindAmount: "Вы назначили сумму всем участникам, но она не покрывает весь чек" }));
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setIsPending(true);

    if (formRef.current) {
      const formData = new FormData(formRef.current);

      const title = formData.get("title")?.toString() || "";
      const description = formData.get("description")?.toString() || null;
      const totalAmount = Number(formData.get("total-amount"));

      const creator = { id: contextstate.creator.id, participating: contextstate.creator.participating, amount: contextstate.creator.amount };

      const participants = contextstate.participanstList.filter((member) => {
        const isParticipating = member.participating;
        const amount = member.amount;
        const id = member.id;

        if (isParticipating) {
          return { id, amount };
        }
      }) as { id: string; amount: number }[];

      const full: CreateCheckActionData = { title, description, totalAmount, creator, participants };

      const result = await createCheckAction(full, groupId);

      if (!result.success) {
        setServerError(result.error || "Server error");
      }
    }
  };

  useEffect(() => {
    if (showConfirm) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [showConfirm]); // Срабатывает ПОСЛЕ того, как showConfirm изменился и DOM обновился

  if (serverError) {
    throw new Error(serverError);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3 items-center lg:grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-12">
      <div className="inputs-div w-full lg:row-[1/2] lg:col-[1/2] flex flex-col gap-6">
        <div className="relative h-full flex flex-col gap-1">
          <label htmlFor="title" className="block text-lg text-text-primary">
            Название
          </label>
          <input
            ref={inputTitleRef}
            type="text"
            name="title"
            id="title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            autoComplete="off"
            aria-invalid={!!localErrors.title}
            aria-describedby={localErrors.title ? "title-error" : undefined}
            placeholder="Введите название..."
            className={`mt-1 block w-full h-8 bg-bg-secondary rounded-lg shadow-sm sm:text-sm px-3 focus ${localErrors.title ? "focus:ring-error!" : ""}`}
          />

          {localErrors.title && <ErrorPop position="left" inputName={"title"} errorText={localErrors.title} />}
        </div>

        <div>
          <label htmlFor="description" className="block text-lg text-text-secondary">
            Описание <span className="text-bg-tertiary">(необязательно)</span>
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder="Введите описание..."
            className="mt-1 resize-none block w-full bg-bg-secondary rounded-lg border-border shadow-sm sm:text-sm px-3 py-2 focus"
          />
          <div></div>
        </div>

        <div className="relative h-full flex justify-between items-center gap-1">
          <label htmlFor="title" className="block text-lg text-text-primary">
            Сумма
          </label>

          <div className="flex justify-center items-center gap-2">
            <p>₽</p>

            <input
              ref={inputTotalAmountRef}
              type="text"
              inputMode="decimal"
              name="total-amount"
              id="total-amount"
              min="0"
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "");

                if (onlyDigits == "0" || onlyDigits == "") {
                  handleChangeAmount(0);
                } else {
                  handleChangeAmount(Number(onlyDigits));
                }
              }}
              value={contextstate.total < 1 ? "" : contextstate.total}
              autoComplete="off"
              aria-invalid={!!localErrors.totalAmount}
              aria-describedby={localErrors.totalAmount ? "total-amount-error" : undefined}
              className={` block w-30 h-8 bg-bg-secondary rounded-lg justify-self-end shadow-sm sm:text-sm px-3 text-end focus ${
                localErrors.totalAmount || localErrors.shareAmount ? "focus:ring-error!" : ""
              }`}
            />
          </div>
          {localErrors.totalAmount && <ErrorPop position="right" inputName={"total-amount"} errorText={localErrors.totalAmount} />}
        </div>

        <div className={`${contextstate.creator.participating ? "" : "opacity-20"} relative h-full flex justify-between items-center gap-1`}>
          <label htmlFor="title" className="block text-lg text-text-primary">
            Моя часть
          </label>

          <div className="flex justify-center items-center gap-2">
            <p>₽</p>

            <input
              ref={inputMyShareRef}
              disabled={!contextstate.creator.participating}
              //   readOnly={!isEqualParticipantsAmounts(contextstate.participanstList) && isAllAdded(contextstate.participanstList)}
              type="text"
              inputMode="decimal"
              min="0"
              name="creator-share"
              id="creator-share"
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "");
                if (onlyDigits == "0" || onlyDigits == "") {
                  handleChangeMyShare(0);
                } else {
                  handleChangeMyShare(Number(onlyDigits));
                }
              }}
              value={contextstate.creator.amount == 0 ? "" : contextstate.creator.amount}
              autoComplete="off"
              aria-invalid={!!localErrors.myShare}
              aria-describedby={localErrors.myShare ? "title-error" : undefined}
              className={` block w-30 h-8 bg-bg-secondary rounded-lg justify-self-end shadow-sm sm:text-sm px-3 text-end focus ${localErrors.myShare ? "focus:ring-error!" : ""}`}
            />

            {localErrors.myShare && <ErrorPop position="right" inputName={"total-amount"} errorText={localErrors.myShare} />}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ToggleButton error={null} labelText={"Добавить всех"} toggleChange={handleToggleAddAll} toggleState={isAddAll} inputName={"add-all"} />
          <div>
            <ToggleButton
              error={localErrors.shareMember || localErrors.shareAmount || null}
              labelText={"Поделить сумму"}
              toggleChange={handleToggleShare}
              toggleState={shareAmount}
              inputName={"share-amount"}
            />
          </div>
        </div>

        <div ref={tabsRef} className={`flex w-full h-8 bg-bg-secondary rounded-2xl lg:hidden`}>
          <TabChangeButton tabs={tabs} currentTab={tabType} changeTab={setTabType} />
        </div>

        <span className="block w-full bg-surface mt-6 h-0.5 "></span>
      </div>

      <div ref={membersListhRef} className={`${tabType == "members" ? "flex" : "hidden"} relative lg:flex flex-col lg:col-[1/2] row-[2/3] gap-2 w-full min-h-100 mb-14`}>
        {localErrors.participants && <ErrorPop position="center" inputName={"participants"} errorText={localErrors.participants} />}

        <p className="text-xl">Участники</p>
        <div className="h-10">
          <Search mode="state" onSearchChange={onSearchChange} placeholder="Поиск.. " />
        </div>
        <MembersList searchQuery={searchQuery} />
      </div>

      <div className={`${tabType == "amounts" ? "flex" : "hidden"} relative lg:h-full lg:flex flex-col lg:col-[2/3] row-[1/3] justify-self-start self-start w-full gap-2 min-h-100 mb-14`}>
        <span className="absolute top-0 -left-6 block w-0.5 h-full bg-surface "></span>

        <div className="flex justify-between items-center">
          <p className="text-xl">Суммы</p>
          <p className={`text-md ${remindAmount < 0 ? "text-error" : remindAmount == 0 ? "text-success" : "text-warning"}`}>Не распределено: {remindAmount} ₽</p>
        </div>
        <ParticipantsList />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={`${
          isPending ? "" : ""
        } fixed bottom-3 left-1/2 md:left-full -translate-x-1/2 md:-translate-x-[calc(100%+1rem)] md:bottom-4 inline-flex cursor-pointer justify-center items-center rounded-lg border font-medium border-border-focus bg-accent py-3 px-8 w-60 h-14 text-text-inverted text-xl md:text-2xl shadow-lg hover:bg-accent-hover hover:text-text-secondary hover:shadow-[2px_2px_10px_var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200`}>
        <p>Создать Чек</p>
      </button>

      {localErrors.participantAmount && (
        <div
          id={`participant-amount-error`}
          role="alert"
          className={`
			fixed bottom-30 left-1/2 -translate-x-1/2 z-50 flex justify-center w-3/4 items-center text-center bg-error text-text-primary px-3 py-2 rounded-lg shadow-lg transition-all`}>
          {localErrors.participantAmount}
        </div>
      )}

      {localErrors.remindAmount && (
        <div
          id={`amount-error`}
          role="alert"
          className={`
			fixed bottom-30 left-1/2 -translate-x-1/2 z-50 flex justify-center w-3/4 items-center text-center bg-error text-text-primary px-3 py-2 rounded-lg shadow-lg transition-all`}>
          {localErrors.remindAmount}
        </div>
      )}

      {showConfirm && (
        <>
          <div className="fixed w-full h-full top-0 left-0 z-50 bg-bg-primary/90"></div>
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-5/6 h-fit z-50">
            <ConfirmCreate
              onCancel={() => {
                setIsPending(false);
                setShowConfirm(false);
              }}
              onConfirm={handleConfirm}
              isPending={isPending}
              remindAmount={remindAmount}
              title={title}
              totalAmount={contextstate.total}
              creator={contextstate.creator}
              members={contextstate.participanstList}
            />
          </div>
        </>
      )}
      {localErrors.succes && (
        <div
          id={`participant-amount-error`}
          role="alert"
          className={`
			fixed bottom-30 left-1/2 -translate-x-1/2 z-50 flex justify-center w-3/4 h-20 items-center text-center bg-success text-text-primary px-3 py-2 rounded-lg shadow-lg transition-all`}>
          {localErrors.succes}
        </div>
      )}
    </form>
  );
}
