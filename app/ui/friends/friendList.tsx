import UserCard from "./userCard";
import EmptyNotification from "./emptyNotification";
import { User } from "@/app/lib/types/types.user";
import { FriendsListType } from "@/app/lib/types/types.filters";
import { getFriendsList } from "@/app/lib/data/data.friendship";
import { FriendsListResult, GetFriendsOptions } from "@/app/lib/types/types.friends";
import Pagination from "../paginaton";
import FriendListSkeleton from "@/app/lib/skeletons/friendsListSkeleton";

export default async function FriendList({ options, filterType }: { options: GetFriendsOptions; filterType: FriendsListType }) {
  const friendsListResult: FriendsListResult = await getFriendsList(options);

  return (
    <>
      <div className="flex flex-col gap-3 grow w-full">
        {friendsListResult.users.length > 0 ? (
          friendsListResult.users.map((user) => {
            return <UserCard key={user.id} userData={user} friendshipId={user.friendship_id} />;
          })
        ) : filterType !== "friends" ? (
          <EmptyNotification>Нет заявок</EmptyNotification>
        ) : (
          <EmptyNotification>Нет друзей</EmptyNotification>
        )}

        <div className={`${friendsListResult.totalPages == 1 ? "hidden" : "block self-center"}`}>
          <Pagination totalPages={friendsListResult.totalPages} currentPage={options.currentPage || 1} />
        </div>
      </div>
    </>
  );
}
