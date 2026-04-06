import UserCard from "./userCard";
import EmptyNotification from "./emptyNotification";
import { searchUserByEmail } from "@/app/lib/data/data.friendship";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SearchedNewFriend({ query }: { query: string }) {
	
	const session = await auth();
  
	if (!session?.user?.id) {
	  redirect('/login');
	}


  const searchedUser = query ? await searchUserByEmail(session.user.id, query) : null;

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
