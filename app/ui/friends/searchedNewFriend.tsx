import UserCard from "./userCard";
import EmptyNotification from "./emptyNotification";
import { searchUserByEmail } from "@/app/lib/data/data.friendship";
import { PROFILE_UUID } from "@/app/lib/placeholders-data";

export default async function SearchedNewFriend({ query }: { query: string }) {
  const searchedUser = query ? await searchUserByEmail(PROFILE_UUID, query) : null;

  return (
    <>
      <div className="flex flex-col gap-3 grow w-full">
        {query == "" ? (
          <EmptyNotification>Введите полный Email..</EmptyNotification>
        ) : searchedUser ? (
          <UserCard key={searchedUser.id} userData={searchedUser} friendshipId={searchedUser.friendship_id} />
        ) : (
          <EmptyNotification>Не найдено</EmptyNotification>
        )}
      </div>
    </>
  );
}
