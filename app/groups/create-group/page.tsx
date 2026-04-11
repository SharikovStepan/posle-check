import Link from "next/link";
import PageHeader from "../../ui/pageHeader";
import CreateGroupForm from "../../ui/groups/createGroupForm";
import { MembersProvider } from "../../ui/groups/membersProvider";
import { Suspense } from "react";
import { getFriendsList } from "@/app/lib/data/data.friendship";
import { FriendsListResult } from "@/app/lib/types/types.friends";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { Metadata } from "next";
import { CreateGroupFormSkeleton } from "@/app/lib/fallbacks/createGroupSkeleton";
export const metadata: Metadata = {
  title: "Создать группу",
};

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const friendsListResult: FriendsListResult = await getFriendsList({ currentUserId: session.user.id, search: "" });

  return (
    <main className="flex flex-col gap-3">
      <div className="header-div md:shrink-0 h-full md:h-(--header-height) flex justify-between items-center mb-2">
        <Link href={"/groups"} className="w-15 h-15 rounded-full bg-surface flex justify-center items-center">
          <ArrowLeftIcon className="w-1/2 h-1/2" />
        </Link>
        <div className="w-fit text-center">
          <PageHeader title={"Создание группы"} />
        </div>
      </div>

      {friendsListResult.users.length != 0 ? (
        <div className="h-full">
          <MembersProvider>
            <Suspense fallback={<CreateGroupFormSkeleton />}>
              <CreateGroupForm initialFriendsData={friendsListResult} />
            </Suspense>
          </MembersProvider>
        </div>
      ) : (
        <div className="bg-bg-secondary p-2 flex flex-col justify-center items-center rounded-lg gap-4">
          <p className="text-text-primary text-md">У вас нет друзей, которых вы могли бы добавить в группу</p>

          <Link href={"/friends?filter=search"} className="p-2 cursor-pointer bg-accent hover:bg-accent-hover text-text-inverted text-lg rounded-lg">
            <p>К поиску друзей</p>
          </Link>
        </div>
      )}
    </main>
  );
}
