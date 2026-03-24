import UserCard from "./userCard";
import EmptyNotification from "./emptyNotification";
import { User } from "@/app/lib/types/types.user";
import { FriendsListType } from "@/app/lib/types/types.filters";

export default function FriendList({ usersData, filterType }: { usersData: User[]; filterType: FriendsListType }) {
  return (
    <>
      {usersData.length > 0 ? (
        usersData.map((user) => {
          return <UserCard key={user.id} userData={user} friendshipId={user.friendship_id} />;
        })
      ) : filterType !== "friends" ? (
        <EmptyNotification>Нет Заявок</EmptyNotification>
      ) : (
        <EmptyNotification>Нет Друзей</EmptyNotification>
      )}
    </>
  );
}
