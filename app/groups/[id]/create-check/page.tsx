import Link from "next/link";
import PageHeader from "../../../ui/pageHeader";
import CreateGroupForm from "../../../ui/groups/createGroupForm";
import SearchMembersList from "../../../ui/groups/searchMembersList";
import { MembersProvider } from "../../../ui/groups/membersProvider";
import { Suspense } from "react";
import FriendListSkeleton from "../../../lib/fallbacks/friendsListSkeleton";
import { getFriendsList } from "@/app/lib/data/data.friendship";
import { FriendsListResult } from "@/app/lib/types/types.friends";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import CreateCheckForm from "@/app/ui/checks/createCheckForm";
import { getGroupMembers } from "@/app/lib/data/data.checks";
import { CreateCheckParticipantsCardsType } from "@/app/lib/types/types.checks";
import { ParticipantsProvider } from "@/app/ui/checks/participantsProvider";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { Metadata } from "next";
import BackButton from "@/app/ui/backButton";
import { CreateCheckFormSkeleton } from "@/app/lib/fallbacks/createCheckSkeleton";
export const metadata: Metadata = {
  title: "Создать чек",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await props.params;
  const id = params.id;

  const members = await getGroupMembers(id, session.user.id);

  const checkParticipants: CreateCheckParticipantsCardsType[] = members.filter((member) => !member.isCreator);
  const creator: CreateCheckParticipantsCardsType = members.find((member) => member.isCreator) || {
    id: "",
    username: "",
    full_name: null,
    avatar_url: null,
    participating: true,
    amount: 0,
    isCreator: true,
    role: "admin",
    status: "accepted",
    invited_by: "",
  };

  return (
    <main className="flex flex-col gap-3 ">
      <div className="header-div md:h-(--header-height) flex md:shrink-0 justify-between items-center mb-2">
        <BackButton className="cursor-pointer w-15 h-15 rounded-full bg-surface flex justify-center items-center">
          <ArrowLeftIcon className="w-1/2 h-1/2" />
        </BackButton>
        <PageHeader title={"Новый чек"} />
      </div>

      <div className="h-full min-h-120">
        <ParticipantsProvider initialState={{ participanstList: checkParticipants, creator: creator, lastDispatch: { type: "ADD_ALL" }, total: 0, tips: 0 }}>
          <Suspense fallback={<CreateCheckFormSkeleton />}>
            <CreateCheckForm groupId={id} />
          </Suspense>
        </ParticipantsProvider>
      </div>
    </main>
  );
}
