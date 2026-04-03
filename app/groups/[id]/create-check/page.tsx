import Link from "next/link";
import PageHeader from "../../../ui/pageHeader";
import CreateGroupForm from "../../../ui/groups/createGroupForm";
import SearchMembersList from "../../../ui/groups/searchMembersList";
import { PROFILE_UUID } from "../../../lib/placeholders-data";
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

export default async function Page(props: { params: Promise<{ id: string }> }) {
  //   const friendsListResult: FriendsListResult = await getFriendsList({ currentUserId: PROFILE_UUID, search: "" });

  const params = await props.params;
  const id = params.id;

  const members = await getGroupMembers(id, PROFILE_UUID);

  const checkParticipants: CreateCheckParticipantsCardsType[] = members.filter((member) => !member.isCreator);
  const creator: CreateCheckParticipantsCardsType = members.find((member) => member.isCreator) || {
    id: "",
    username: "",
    full_name: null,
    avatar_url: null,
    participating: true,
    amount: 0,
    isCreator: true,
  };

  return (
    <main className="flex flex-col gap-3">
      <div className="header-div h-full md:h-(--header-height) flex justify-between items-center mb-2">
        <Link href={"/groups"} className="w-15 h-15 rounded-full bg-surface flex justify-center items-center">
          <ArrowLeftIcon className="w-1/2 h-1/2" />
        </Link>
        <PageHeader title={"Новый чек"} />
      </div>

      <div className="h-full">
        <ParticipantsProvider initialState={{ participanstList: checkParticipants, creator: creator, lastDispatch: { type: "ADD_ALL" }, total: 0 }}>
          <Suspense fallback={<div>Загрузка...</div>}>
            <CreateCheckForm checkParticipants={checkParticipants} />
          </Suspense>
        </ParticipantsProvider>
      </div>
    </main>
  );
}
