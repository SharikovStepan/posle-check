"use client";

import { User } from "@/app/lib/types/types.user";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import DispatchMemberButton from "./dispatchMemberButton";
import { useMembersContext } from "./membersProvider";
import { motion } from "motion/react";

export default function EditMemberCard({ userData, choosedList = false, marked = true }: { userData: User; choosedList?: boolean; marked?: boolean }) {
  const memberContext = useMembersContext();

  const divClassNames = {
    notChoosedList: "cursor-pointer",
    notChoosedListNotMarked: "hover:border-accent-light/10 hover:bg-surface-hover",
    notChoosedListMarked: "border-border-focus hover:border-border-focus/50 bg-accent-light/7! hover:bg-accent-hover/13!",
  };
  return (
    <>
      <div
        onClick={() => {
          if (!choosedList) {
            if (marked) {
              memberContext.dispatch({ type: "DELETE_MEMBER", payload: userData });
            } else {
              memberContext.dispatch({ type: "ADD_MEMBER", payload: userData });
            }
          }
        }}
        className={`relative p-2 rounded-2xl bg-surface h-20 flex gap-3 justify-between items-center transition-all duration-200 border border-border shadow-md ${
          !choosedList && marked ? divClassNames.notChoosedListMarked : !choosedList && !marked ? divClassNames.notChoosedListNotMarked : ""
        } ${!choosedList && "cursor-pointer"}`}>
        <div className="h-full flex flex-col justify-between">
          <div className={` h-full flex items-center gap-3`}>
            {userData.avatar_url ? (
              <div className={`h-12 rounded-full overflow-hidden`}>
                <img src={userData.avatar_url} alt="group icon" className="w-full h-full object-cover" />
              </div>
            ) : (
              <UserCircleIcon className={`h-12 w-full text-accent/80 overflow-hidden`} />
            )}
            <p className="text-text-primary text-lg">{userData.full_name || userData.username}</p>
          </div>
        </div>

        <div className="flex w-fit flex-col md:flex-row gap-2 justify-end items-center">
          {choosedList ? (
            <DispatchMemberButton className="bg-error p-2 rounded-md" type={{ type: "DELETE_MEMBER", payload: userData }}>
              Убрать
            </DispatchMemberButton>
          ) : (
            //   <DispatchMemberButton className="bg-success p-2 rounded-md" type={{ type: "ADD_MEMBER", payload: userData }}>
            //     Добавить
            //   </DispatchMemberButton>
            ""
          )}
        </div>
      </div>
    </>
  );
}
