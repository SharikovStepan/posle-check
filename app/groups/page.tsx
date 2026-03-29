import Link from "next/link";
import PageHeader from "../ui/pageHeader";
import { FilterButton, GroupListType, SortBy, SortOrder } from "../lib/types/types.filters";
import { GetGroupsOptions } from "../lib/types/types.groups";
import { PROFILE_UUID } from "../lib/placeholders-data";
import { Suspense } from "react";
import Search from "../ui/search";
import OrderSettings from "../ui/orderSettings";
import GroupsList from "../ui/groups/groupsList";
import { PlusIcon } from "@heroicons/react/24/outline";
import GroupsListSkeleton from "../lib/fallbacks/groupsListSkeleton";
import FilterButtons from "../ui/filterButtons";

const UserGroupIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
</svg>
`;

const PencilSquareIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>
`;

const friendsFilters: FilterButton<GroupListType>[] = [
  { filterType: "all", text: "Все", icon: UserGroupIcon },
  { filterType: "created_by_me", text: "Созданные мною", icon: PencilSquareIcon },
  // { filterType: 'created_by_others', text: "Не мною", icon: PencilSquareIcon },
];

export default async function Page(props: { searchParams?: Promise<{ query?: string; filter: GroupListType; sortBy?: SortBy; order?: SortOrder; page?: string }> }) {
  const searchParams = await props.searchParams;

  const query = searchParams?.query || "";
  const filterType = searchParams?.filter || "all";
  const currentPage = Number(searchParams?.page) || 1;

  const order: SortOrder = (searchParams?.order as SortOrder) || null;
  const sortBy: SortBy | null = (searchParams?.sortBy as SortBy) || null;

  const options: GetGroupsOptions = {
    currentUserId: PROFILE_UUID,
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

  return (
    <>
      <main className="main-div">
        <div className="header-div h-full flex justify-between items-center">
          <PageHeader title={"Группы"} />

          <div className="h-full flex justify-center items-center">
            <Link
              className=" flex justify-center items-center transition-all duration-200 cursor-pointer text-text-inverted bg-accent rounded-full w-15 h-15 hover:bg-accent-hover hover:text-text-primary"
              href={"/groups/create-group"}>
              <PlusIcon className="w-1/2 h-1/2" />
            </Link>
          </div>
        </div>

        <div className="control-div flex flex-col gap-2">
          <div className="w-full h-10">
            <Search placeholder={`Введите название...`} />
          </div>

          <>
            <div className="flex bg-bg-secondary rounded-md w-full h-10 justify-between ">
              <FilterButtons filters={friendsFilters} />
            </div>
            <OrderSettings />
          </>
        </div>

        <section className="content-div rounded-md h-full mt-4 flex flex-col gap-3 items-center">
          <Suspense fallback={<GroupsListSkeleton count={5} />}>
            <GroupsList options={options} />
          </Suspense>
        </section>
      </main>
    </>
  );
}
