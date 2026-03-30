"use client";

import { PROFILE_UUID } from "@/app/lib/placeholders-data";
import { useActionState, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import Spinner from "../spinner";
import ToggleButton from "../toggleButton";
import Search from "../search";
import SearchMembersList from "../groups/searchMembersList";
import { CreateCheckPageTabs, CreateCheckParticipantsCardsType, ParticipantsActions } from "@/app/lib/types/types.checks";
import { FilterButton } from "@/app/lib/types/types.filters";
import TabChangeButton from "../tabChangeButtons";
import { participantsReducer } from "./participants-reducer";
import MembersList from "./membersList";
import { useParticipantsContext } from "./participantsProvider";
import ParticipantsList from "./participantsList";

const tabs: FilterButton<CreateCheckPageTabs>[] = [
  { filterType: "members", text: "Участники" },
  { filterType: "amounts", text: "Суммы" },
];

export default function CreateCheckForm({ checkParticipants }: { checkParticipants: CreateCheckParticipantsCardsType[] }) {
  const [tabType, setTabType] = useState<CreateCheckPageTabs>("amounts");

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [myShare, setMyShare] = useState<number>(0);

  const [isAddAll, setIsAddAll] = useState<boolean>(true);
  const [shareAmount, setShareAmount] = useState<boolean>(false);

  const { state: contextstate, dispatch } = useParticipantsContext();

  //   const [participantsList, dispatch] = useReducer(participantsReducer, checkParticipants);

  useEffect(() => {
    switch (contextstate.lastDispatch) {
      case "DELETE_FROM_PARTICIPANTS":
        setIsAddAll(false);
        break;
      case "ADD_TO_PARTICIPANTS":
        const notAll = contextstate.participanstList.find((member) => !member.participating);
        if (!notAll) {
          setIsAddAll(true);
        }
        break;
      case "CLEAR_AMOUNT":
        setShareAmount(false);
        break;
      default:
        break;
    }
  }, [contextstate.lastDispatch]);

  useEffect(() => {
    if (contextstate.lastDispatch == "SET_AMOUNT") {
      const isEqual = contextstate.participanstList.every((member) => member.amount == contextstate.participanstList[0].amount);
      if (isEqual) {
        setShareAmount(true);
      } else {
        setShareAmount(false);
      }
    }
    console.log("contextstate.participanstList", contextstate.participanstList);
    console.log("contextstate.lastDispatch", contextstate.lastDispatch);
  }, [contextstate.participanstList]);

  useEffect(() => {
    if (isAddAll) {
      dispatch({ type: "ADD_ALL" });
    } else if (!isAddAll && contextstate.lastDispatch != "DELETE_FROM_PARTICIPANTS") {
      dispatch({ type: "DELETE_ALL" });
    }
  }, [isAddAll]);

  useEffect(() => {
    if (shareAmount) {
      const participatedCount = contextstate.participanstList.filter((member) => member.participating).length;

      const shareAmountValue = amount / participatedCount;
      setMyShare(shareAmountValue);
      dispatch({ type: "SHARE_AMOUNT", payload: { amount: shareAmountValue } });
    } else if (!shareAmount && contextstate.lastDispatch != "CLEAR_AMOUNT" && contextstate.lastDispatch != "SET_AMOUNT") {
      dispatch({ type: "CANCEL_SHARE" });
      setMyShare(0);
    }
  }, [shareAmount]);

//   useEffect(() => {
//     if (myShare != contextstate.participanstList[0].amount) {
//       setShareAmount(false);
//     }
//   }, [myShare]);

  //   const [state, formAction, isPending] = useActionState<CreateGroupState, FormData>(createGroupAction, { errors: {} });

  const [visibleErrors, setVisibleErrors] = useState<{ title: boolean; members: boolean }>({ title: false, members: false });

  const visibleErrorTmrRef = useRef<NodeJS.Timeout | null>(null);

  const inputNameRef = useRef<HTMLInputElement | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  //   const [sortByState, setSortByState] = useState<SortBy>("date");
  //   const [orderState, setOrderState] = useState<SortOrder>("asc");

  //   const friendsListOptions = useMemo<GetFriendsOptions>(
  //     () => ({
  //       currentUserId: PROFILE_UUID,
  //       filter: "friends",
  //       search: searchQuery,
  //       sortBy: sortByState,
  //       order: orderState,
  //     }),
  //     [searchQuery, sortByState, orderState]
  //   );

  const onSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  //   useEffect(() => {
  //     if (state.errors?.title && inputNameRef.current) {
  //       setVisibleErrors({ title: true, members: false });
  //       visibleErrorTmrRef.current = setTimeout(() => {
  //         setVisibleErrors({ title: false, members: false });
  //       }, 2500);
  //       inputNameRef.current.focus();
  //     }

  //     if (state.errors?.members && !state.errors?.title) {
  //       setVisibleErrors({ title: false, members: true });
  //       visibleErrorTmrRef.current = setTimeout(() => {
  //         setVisibleErrors({ title: false, members: false });
  //       }, 2500);
  //     }

  //     if (state.errors?.general) {
  //       throw new Error("DB failed");
  //     }

  //     return () => {
  //       if (visibleErrorTmrRef.current) {
  //         clearTimeout(visibleErrorTmrRef.current);
  //       }
  //     };
  //   }, [state]);

  return (
    <form action={""} className="flex flex-col gap-3 items-center lg:grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-12">
      <div className="inputs-div w-full lg:row-[1/2] lg:col-[1/2] flex flex-col gap-6">
        <div className="relative h-full flex flex-col gap-1">
          <label htmlFor="title" className="block text-lg text-text-primary">
            Название
          </label>
          <input
            ref={inputNameRef}
            type="text"
            name="title"
            id="title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            autoComplete="off"
            // aria-invalid={!!state.errors?.title}
            // aria-describedby={state.errors?.title ? "title-error" : undefined}
            placeholder="Введите название..."
            className={`mt-1 block w-full h-8 bg-bg-secondary rounded-lg shadow-sm sm:text-sm px-3 focus ${false && visibleErrors.title ? "focus:ring-error!" : ""}`}
          />

          {/* {state.errors?.title && visibleErrors.title && (
            <p id="tite-error" className="text-red-500 text-sm mt-1 absolute bottom-0 left-0 translate-y-full">
              {state.errors?.title}
            </p>
          )} */}
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
            <p>Р</p>

            <input
              // ref={inputNameRef}
              type="number"
              name="amount"
              id="amount"
              onChange={(e) => setAmount(Number(e.target.value))}
              value={amount}
              autoComplete="off"
              // aria-invalid={!!state.errors?.title}
              // aria-describedby={state.errors?.title ? "title-error" : undefined}
              className={` block w-30 h-8 bg-bg-secondary rounded-lg justify-self-end shadow-sm sm:text-sm px-3 text-end focus ${false ? "focus:ring-error!" : ""}`}
            />
          </div>
          {/* {state.errors?.title && visibleErrors.title && (
            <p id="tite-error" className="text-red-500 text-sm mt-1 absolute bottom-0 left-0 translate-y-full">
              {state.errors?.title}
            </p>
          )} */}
        </div>

        <div className="relative h-full flex justify-between items-center gap-1">
          <label htmlFor="title" className="block text-lg text-text-primary">
            Моя часть
          </label>

          <div className="flex justify-center items-center gap-2">
            <p>Р</p>

            <input
              // ref={inputNameRef}
              type="number"
              name="my_share"
              id="my_share"
              onChange={(e) => setMyShare(Number(e.target.value))}
              value={myShare}
              autoComplete="off"
              // aria-invalid={!!state.errors?.title}
              // aria-describedby={state.errors?.title ? "title-error" : undefined}
              className={` block w-30 h-8 bg-bg-secondary rounded-lg justify-self-end shadow-sm sm:text-sm px-3 text-end focus ${false ? "focus:ring-error!" : ""}`}
            />
          </div>
          {/* {state.errors?.title && visibleErrors.title && (
            <p id="tite-error" className="text-red-500 text-sm mt-1 absolute bottom-0 left-0 translate-y-full">
              {state.errors?.title}
            </p>
          )} */}
        </div>

        <div className="flex flex-col gap-4">
          <ToggleButton labelText={"Добавить всех"} toggleChange={setIsAddAll} toggleState={isAddAll} inputName={"add-all"} />
          <ToggleButton labelText={"Поделить сумму"} toggleChange={setShareAmount} toggleState={shareAmount} inputName={"share-amount"} />
        </div>

        <div className={`flex w-full h-8 bg-bg-secondary rounded-2xl lg:hidden`}>
          <TabChangeButton tabs={tabs} currentTab={tabType} changeTab={setTabType} />
        </div>

        <span className="block w-full bg-surface mt-6 h-0.5 "></span>
      </div>

      {/* <div className={`${true ? "block" : "hidden"} w-full lg:block lg:col-[1/2] row-[2/3]`}>
        <div className="control-div flex flex-col gap-3 mb-6">
          <div className="h-10">
            <Search mode="state" onSearchChange={onSearchChange} placeholder="Поиск.. " />
          </div>
        </div>
      </div> */}

      <div className={`${tabType == "members" ? "flex" : "hidden"} lg:flex flex-col lg:col-[1/2] row-[2/3] gap-2 w-full min-h-100 mb-14`}>
        <p className="text-xl">Участники</p>

        <div className="h-10">
          <Search mode="state" onSearchChange={onSearchChange} placeholder="Поиск.. " />
        </div>
        <MembersList searchQuery={searchQuery} />
      </div>

      <div className={`${tabType == "amounts" ? "block" : "hidden"}lg:block relative lg:h-full flex flex-col lg:col-[2/3] row-[1/3] justify-self-start self-start w-full gap-2 min-h-100 mb-14`}>
        <span className="absolute top-0 -left-6 block w-0.5 h-full bg-surface "></span>

        <p className="text-xl">Суммы</p>
        <ParticipantsList />
      </div>

      {/* 
      <div className="members-div w-full flex flex-col gap-3 mt-4">
        <div className="flex justify-between items-center">
          <p className="text-lg">Добавить друзей</p>
          <p className="inline-block bg-accent/18 px-4 py-1 rounded-2xl text-accent-light">
            Добавленно: <span>{membersContex.state.length}</span>
          </p>
        </div>

        <div className={`lg:hidden grid grid-cols-[1fr_1fr] bg-surface h-8 rounded-xl `}>
          <button
            type="button"
            disabled={tabType == "friends"}
            onClick={() => setTabType("friends")}
            className={`${
              tabType === "friends" ? "bg-accent pointer-events-none text-text-inverted" : "text-text-primary bg-surface hover:bg-surface-hover"
            } w-full cursor-pointer rounded-xl transition-all duration-200`}>
            Друзья
          </button>
          <button
            type="button"
            disabled={tabType == "members"}
            onClick={() => setTabType("members")}
            className={`${
              tabType === "members" ? "bg-accent pointer-events-none text-text-inverted" : "text-text-primary bg-surface hover:bg-surface-hover"
            } w-full cursor-pointer rounded-xl transition-all duration-200`}>
            Добавленные
          </button>
        </div>

        <div className={`${tabType == "friends" ? "block" : "hidden"} lg:block lg:col-[1/2] row-[2/3]`}>
          <div className="control-div flex flex-col gap-3 mb-6">
            <div className="h-10">
              <Search mode="state" onSearchChange={onSearchChange} placeholder="Поиск.. " />
            </div>
            <OrderSettings mode="state" onOrderChange={onOrderChange} />
          </div>
          <SearchMembersList choosedMembers={membersContex.state} initialData={initialFriendsData} options={friendsListOptions} />
        </div>
      </div>

      <div className={`${tabType == "members" ? "block w-full" : "hidden"} lg:block lg:col-[2/3] row-[1/3] lg:h-full`}>
        <AddedMembersList usersData={membersContex.state} />
        <input name="members" type="text" hidden={true} defaultValue={JSON.stringify(membersContex.ids)} />
        <input name="currentUserId" type="text" hidden={true} defaultValue={PROFILE_UUID} />
      </div>

      {state.errors?.members && visibleErrors.members && (
        <div role="alert" className="fixed z-50 flex justify-center items-center text-center top-1/2 left-1/2 -translate-x-1/2 bg-error text-text-primary px-6 py-3 rounded-lg shadow-lg">
          {state.errors?.members}
        </div>
      )} */}

      {/* <button
        type="submit"
        disabled={isPending}
        className={`${
          isPending ? "" : ""
        } fixed bottom-3 left-1/2 md:left-full -translate-x-1/2 md:-translate-x-[calc(100%+1rem)] md:bottom-4 inline-flex cursor-pointer justify-center items-center rounded-lg border font-medium border-border-focus bg-accent py-3 px-8 w-60 h-14 text-text-inverted text-xl md:text-2xl shadow-lg hover:bg-accent-hover hover:text-text-secondary hover:shadow-[2px_2px_10px_var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200`}>
        <p className={`${isPending ? "hidden" : ""}`}>Создать группу</p>
        <Spinner className={`${isPending ? "block" : "hidden!"}`} />
      </button> */}
    </form>
  );
}
