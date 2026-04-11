import { GroupListTabs, SortBy, SortOrder } from "@/app/lib/types/types.filters";
import { GetGroupsOptions, GroupListResult } from "@/app/lib/types/types.groups";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GroupsListView } from "./groupsListView";
import { getGroupsList } from "@/app/lib/data/data.groups";

export async function GroupsListData({ searchParamsPromise }: { searchParamsPromise?: Promise<{ query?: string; filter: GroupListTabs; sortBy?: SortBy; order?: SortOrder; page?: string }> }) {
  
const session = await auth();


  if (!session?.user?.id) {
    redirect("/login");
  }

  const searchParams = await searchParamsPromise;

  const query = searchParams?.query || "";
  const tabType = searchParams?.filter || "all";
  const currentPage = Number(searchParams?.page) || 1;

  const order = (searchParams?.order as SortOrder) || null;
  const sortBy = (searchParams?.sortBy as SortBy) || null;

  const options: GetGroupsOptions = {
    currentUserId: session.user.id,
    filter: tabType,
    currentPage,
    search: query,
  };

  if (sortBy) options.sortBy = sortBy;
  if (order) options.order = order;

  const groupsData: GroupListResult = await getGroupsList(options);

  return <GroupsListView groupsData={groupsData} currentUserId={session.user.id} />;
}
