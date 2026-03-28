"use client";

import { Suspense, useActionState, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMembersContext } from "./membersProvider";
import Search from "../search";
import OrderSettings from "../orderSettings";
import AddedMembersList from "./addedMembersList";
import SearchMembersList from "./searchMembersList";
import { FriendsListResult, GetFriendsOptions } from "@/app/lib/types/types.friends";
import { PROFILE_UUID } from "@/app/lib/placeholders-data";
import { SortBy, SortOrder } from "@/app/lib/types/types.filters";
import { createGroupAction, CreateGroupState } from "@/app/lib/actions/actions.groups";
import Spinner from "../spinner";

export default function CreateGroupForm({ initialFriendsData, children }: { initialFriendsData: FriendsListResult; children?: React.ReactNode }) {
  const membersContex = useMembersContext();

  const [tabType, setTabType] = useState<"friends" | "members">("friends");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [state, formAction, isPending] = useActionState<CreateGroupState, FormData>(createGroupAction, { errors: {} });

  const [visibleErrors, setVisibleErrors] = useState<{ name: boolean; members: boolean }>({ name: false, members: false });

  const visibleErrorTmrRef = useRef<NodeJS.Timeout | null>(null);

  const inputNameRef = useRef<HTMLInputElement | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortByState, setSortByState] = useState<SortBy>("date");
  const [orderState, setOrderState] = useState<SortOrder>("asc");

  const friendsListOptions = useMemo<GetFriendsOptions>(
    () => ({
      currentUserId: PROFILE_UUID,
      filter: "friends",
      search: searchQuery,
      sortBy: sortByState,
      order: orderState,
    }),
    [searchQuery, sortByState, orderState]
  );

  const onSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const onOrderChange = useCallback((sortBy: SortBy, order: SortOrder) => {
    setSortByState(sortBy);
    setOrderState(order);
  }, []);

  useEffect(() => {
    if (state.errors?.name && inputNameRef.current) {
      setVisibleErrors({ name: true, members: false });
      visibleErrorTmrRef.current = setTimeout(() => {
        setVisibleErrors({ name: false, members: false });
      }, 2500);
      inputNameRef.current.focus();
    }

    if (state.errors?.members && !state.errors?.name) {
      setVisibleErrors({ name: false, members: true });
      visibleErrorTmrRef.current = setTimeout(() => {
        setVisibleErrors({ name: false, members: false });
      }, 2500);
    }

    if (state.errors?.general) {
      throw new Error("DB failed");
    }

    return () => {
      if (visibleErrorTmrRef.current) {
        clearTimeout(visibleErrorTmrRef.current);
      }
    };
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-3 items-center lg:grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-12">
      <div className="inputs-div w-full lg:row-[1/2] lg:col-[1/2] flex flex-col gap-2">
        <div className="relative h-full mb-4 flex flex-col gap-1">
          <label htmlFor="name" className="block text-lg text-text-primary">
            Название
          </label>
          <input
            ref={inputNameRef}
            type="text"
            name="name"
            id="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            autoComplete="off"
            aria-invalid={!!state.errors?.name}
            aria-describedby={state.errors?.name ? "name-error" : undefined}
            placeholder="Введите название..."
            className={`mt-1 block w-full h-8 bg-bg-secondary rounded-lg shadow-sm sm:text-sm px-3 focus ${state.errors?.name && visibleErrors.name ? "focus:ring-error!" : ""}`}
          />

          {state.errors?.name && visibleErrors.name && (
            <p id="name-error" className="text-red-500 text-sm mt-1 absolute bottom-0 left-0 translate-y-full">
              {state.errors?.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-lg text-text-secondary">
            Описание <span className="text-bg-tertiary">(необязательно)</span>
          </label>
          <textarea
            name="description"
            id="description"
            rows={5}
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder="Введите описание..."
            className="mt-1 resize-none block w-full bg-bg-secondary rounded-lg border-border shadow-sm sm:text-sm px-3 py-2 focus"
          />
          <div></div>
        </div>

        <span className="block w-full bg-surface mt-6 h-0.5 "></span>
      </div>

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
      )}

      <button
        type="submit"
        disabled={isPending}
        className={`${
          isPending ? "" : ""
        } fixed bottom-3 left-1/2 md:left-full -translate-x-1/2 md:-translate-x-[calc(100%+1rem)] md:bottom-4 inline-flex cursor-pointer justify-center items-center rounded-lg border font-medium border-border-focus bg-accent py-3 px-8 w-60 h-14 text-text-inverted text-xl md:text-2xl shadow-lg hover:bg-accent-hover hover:text-text-secondary hover:shadow-[2px_2px_10px_var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200`}>
        <p className={`${isPending ? "hidden" : ""}`}>Создать группу</p>
        <Spinner className={`${isPending ? "block" : "hidden!"}`} />
      </button>
    </form>
  );
}
