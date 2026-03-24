// import type { User } from "@/app/lib/interfaces";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { friendText } from "./utils";
import AddFriendButton from "./addFriendButton";
import RequestFriendButton from "./requestFriendButton";
import { PROFILE_UUID } from "@/app/lib/placeholders-data";
import { XMarkIcon } from "@heroicons/react/24/outline";

import Link from "next/link";
import { User } from "@/app/lib/types/types.user";

export default function UserCard({ userData, friendshipId }: { friendshipId: string | null; userData: User; isSearched?: boolean }) {
  const friendStatusDesc = userData.id === PROFILE_UUID ? "Это вы" : friendText(userData.friendship_status);
  return (
    <>
      <div className="relative p-2 rounded-md bg-surface-elevated h-20 flex gap-3 justify-between items-center border border-border shadow-md">
        <div className="h-full">
          <div className={`${friendStatusDesc == "" ? "h-full" : ""} flex items-center gap-3`}>
            {!userData.avatar_url ? <UserCircleIcon className={`${friendStatusDesc == "" ? "h-15" : "h-10"} text-foreground`} /> : ""}
            <p className="text-foreground text-lg">{userData.full_name || userData.username}</p>
          </div>
          {friendStatusDesc != "" && <div className="text-muted-foreground">{friendStatusDesc}</div>}
        </div>

        <div className="flex w-fit flex-col md:flex-row gap-2 justify-end items-center">
          {userData.friendship_status == "none" && userData.id !== PROFILE_UUID ? (
            <AddFriendButton friendId={userData.id}>
              <p>Добавить в друзья</p>
            </AddFriendButton>
          ) : userData.friendship_status == "pending" && friendshipId ? (
            <>
              <RequestFriendButton action={"accept"} friendshipId={friendshipId} className="bg-success text-success-foreground w-full hover:bg-success/90">
                <p className="">Принять</p>
              </RequestFriendButton>
              <RequestFriendButton action={"decline"} friendshipId={friendshipId} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                <p>Отклонить</p>
              </RequestFriendButton>
            </>
          ) : userData.friendship_status == "awaiting_confirm" && friendshipId ? (
            <RequestFriendButton action={"cancel"} friendshipId={friendshipId} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <p>Удалить заявку</p>
            </RequestFriendButton>
          ) : userData.friendship_status == "declined" && friendshipId ? (
            <>
              <RequestFriendButton action={"send"} friendshipId={friendshipId} className="bg-success text-success-foreground hover:bg-success/90">
                <p>Отправить ещё раз</p>
              </RequestFriendButton>
              <RequestFriendButton action={"cancel"} friendshipId={friendshipId} className="bg-destructive w-full text-destructive-foreground hover:bg-destructive/90">
                <p>Удалить заявку</p>
              </RequestFriendButton>
            </>
          ) : userData.friendship_status == "friendly" && friendshipId ? (
            <RequestFriendButton action={"cancel"} friendshipId={friendshipId} className="border-destructive border-2 text-destructive hover:bg-destructive/10 hover:border-destructive">
              <XMarkIcon className="h-6 w-6 text-destructive hover:text-destructive" />
            </RequestFriendButton>
          ) : userData.id == PROFILE_UUID ? (
            <Link href={"/profile"} className={`p-2 border-2 rounded-md border-border text-foreground w-full h-10 flex justify-center items-center hover:bg-accent hover:text-accent-foreground`}>
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
