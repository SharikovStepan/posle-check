// import type { User } from "@/app/lib/interfaces";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { friendText } from "./utils";
import AddFriendButton from "./addFriendButton";
import RequestFriendButton from "./requestFriendButton";
import { XMarkIcon } from "@heroicons/react/24/outline";

import Link from "next/link";
import { User } from "@/app/lib/types/types.user";

export default function UserCard({ userData, friendshipId }: { friendshipId: string | null; userData: User; isSearched?: boolean }) {
  const friendStatusDesc = userData.id === "" ? "Это вы" : friendText(userData.friendship_status);
  return (
    <>
      <div className="relative py-2 px-4 rounded-2xl bg-surface h-20 flex gap-3 justify-between items-center border border-border shadow-md">
        <div className="h-full flex justify-start items-center gap-2">
          <div className={`${friendStatusDesc == "" ? "h-full" : ""} flex items-center gap-3`}>
            {userData.avatar_url ? (
              <div className={`${friendStatusDesc == "" ? "h-12" : "h-10"} rounded-full overflow-hidden`}>
                <img src={userData.avatar_url} alt="group icon" className="w-full h-full object-cover" />
              </div>
            ) : (
              <UserCircleIcon className={`${friendStatusDesc == "" ? "h-12" : "h-10"} w-full text-accent/80 overflow-hidden`} />
            )}
          </div>
          <div>
            <p className="text-text-primary text-lg">{userData.full_name || userData.username}</p>
            {friendStatusDesc != "" && <div className="text-text-tertiary/80 text-xs">{friendStatusDesc}</div>}
          </div>
        </div>

        <div className="flex w-fit flex-col md:flex-row gap-2 justify-end items-center">
          {userData.friendship_status == "none" && userData.id !== "UUID" ? (
            <AddFriendButton friendId={userData.id}>
              <p>Добавить</p>
            </AddFriendButton>
          ) : userData.friendship_status == "pending" && friendshipId ? (
            <>
              <RequestFriendButton action={"accept"} friendshipId={friendshipId} className="cursor-pointer bg-success text-text-inverted w-full hover:bg-success/70 ">
                <p className="">Принять</p>
              </RequestFriendButton>
              <RequestFriendButton action={"decline"} friendshipId={friendshipId} className="cursor-pointer bg-error text-text-inverted/80 hover:bg-error/70">
                <p>Отклонить</p>
              </RequestFriendButton>
            </>
          ) : userData.friendship_status == "awaiting_confirm" && friendshipId ? (
            <RequestFriendButton action={"cancel"} friendshipId={friendshipId} className="cursor-pointer bg-error text-text-secondary hover:bg-error/70">
              <p>Удалить заявку</p>
            </RequestFriendButton>
          ) : userData.friendship_status == "declined" && friendshipId ? (
            <>
              <RequestFriendButton action={"send"} friendshipId={friendshipId} className="cursor-pointer bg-success text-success-foreground hover:bg-success/70">
                <p>Отправить ещё раз</p>
              </RequestFriendButton>
              <RequestFriendButton action={"cancel"} friendshipId={friendshipId} className="cursor-pointer bg-error w-full text-text-secondary hover:bg-destructive/70">
                <p>Удалить заявку</p>
              </RequestFriendButton>
            </>
          ) : userData.friendship_status == "friendly" && friendshipId ? (
            ""
          ) : // <RequestFriendButton action={"cancel"} friendshipId={friendshipId} className="cursor-pointer border-error/70 border-2 text-error hover:bg-error/10 hover:border-error/90">
          //   <XMarkIcon className="h-6 w-6 text-error hover:text-error/70" />
          // </RequestFriendButton>
          userData.id == "UUID" ? (
            <Link href={"/profile"} className={`p-2 border-2 rounded-md border-border text-text-primary w-full h-10 flex justify-center items-center hover:bg-accent hover:text-accent-foreground`}>
              <p className="">{"Открыть профиль"}</p>
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}
