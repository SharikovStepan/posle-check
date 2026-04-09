import { getGroupsList } from "@/app/lib/data/data.groups";
import { GetGroupsOptions, GroupListResult } from "@/app/lib/types/types.groups";
import GroupCard from "./groupCard";
import InviteGroupCard from "./inviteGroupCard";
import { GroupListType, SortBy, SortOrder } from "@/app/lib/types/types.filters";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function GroupsList({ searchParamsPromise }: { searchParamsPromise?: Promise<{ query?: string; filter: GroupListType; sortBy?: SortBy; order?: SortOrder; page?: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const searchParams = await searchParamsPromise;

  const query = searchParams?.query || "";
  const filterType = searchParams?.filter || "all";
  const currentPage = Number(searchParams?.page) || 1;

  const order: SortOrder = (searchParams?.order as SortOrder) || null;
  const sortBy: SortBy | null = (searchParams?.sortBy as SortBy) || null;

  const options: GetGroupsOptions = {
    currentUserId: session.user.id,
    filter: filterType,
    currentPage: currentPage,
    search: query,
  };

  if (sortBy) {
    options.sortBy = sortBy;
  }

  if (order) {
    options.order = order;
  }

  const groupsData: GroupListResult = await getGroupsList(options);

  const membered = groupsData.groups.filter((g) => g.current_user_status == "accepted");
  const requests = groupsData.groups.filter((g) => g.current_user_status == "pending");

  return (
    <>
      <div className="w-full flex flex-col gap-3">
        {requests.length != 0 &&
          requests.map((group) => {
            return <InviteGroupCard key={group.id} currentUserId={session.user.id} groupData={group} />;
          })}

        {membered.length != 0 &&
          membered.map((group) => {
            return <GroupCard key={group.id} groupData={group} />;
          })}

        {requests.length == 0 && membered.length == 0 && <p className="w-full text-center">У вас нет групп</p>}
      </div>
    </>
  );
}
