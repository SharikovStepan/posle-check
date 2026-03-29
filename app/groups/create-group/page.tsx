import Link from "next/link";
import PageHeader from "../../ui/pageHeader";
import CreateGroupForm from "../../ui/groups/createGroupForm";
import SearchMembersList from "../../ui/groups/searchMembersList";
import { PROFILE_UUID } from "../../lib/placeholders-data";
import { MembersProvider } from "../../ui/groups/membersProvider";
import { Suspense } from "react";
import FriendListSkeleton from "../../lib/fallbacks/friendsListSkeleton";
import { getFriendsList } from "@/app/lib/data/data.friendship";
import { FriendsListResult } from "@/app/lib/types/types.friends";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default async function Page() {
  const friendsListResult: FriendsListResult = await getFriendsList({ currentUserId: PROFILE_UUID, search: "" });

  return (
    <main className="flex flex-col gap-3">
      <div className="header-div h-full md:h-(--header-height) flex justify-between items-center mb-2">
        <Link href={"/groups"} className="w-15 h-15 rounded-full bg-surface flex justify-center items-center">
          <ArrowLeftIcon className="w-1/2 h-1/2" />
        </Link>
        <PageHeader title={"Создание группы"} />
      </div>

      <div className="h-full">
        <MembersProvider>
          <Suspense fallback={<div>Загрузка...</div>}>
            <CreateGroupForm initialFriendsData={friendsListResult} />
          </Suspense>
        </MembersProvider>
      </div>
    </main>
  );
}
