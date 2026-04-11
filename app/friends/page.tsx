import FriendList from "../ui/friends/friendList";
import PageHeader from "../ui/pageHeader";
import Search from "../ui/searchNavigation";
import OrderSettings from "../ui/orderSettings";
import { FriendsListTabs, SortBy, SortOrder, TabButtons } from "../lib/types/types.filters";
import { GetFriendsOptions } from "../lib/types/types.friends";

import { UserPlusIcon } from "@heroicons/react/24/solid";
import ToggleFilterButton from "../ui/friends/toggleFilterButton";
import { Suspense } from "react";
import SearchedNewFriend from "../ui/friends/searchedNewFriend";
import FriendListSkeleton from "../lib/fallbacks/friendsListSkeleton";
import { SeachLoading } from "../lib/fallbacks/seachLoading";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { Metadata } from "next";
import TabButtonsNavigation from "../ui/tabButtonsNavigation";
import SearchNavigation from "../ui/searchNavigation";
import OrderSettingsNavigation from "../ui/orderSettingsNavigation";
import ToggleSearchModeButton, { ToggleButtonSkeleton } from "../ui/friends/toggleSearchModeButton";
export const metadata: Metadata = {
  title: "Друзья",
};

const UsersIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
</svg>

`;
const ArrowUpLeftIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.49 12 3.74 8.248m0 0 3.75-3.75m-3.75 3.75h16.5V19.5" />
</svg>
`;
const ArrowDownRightIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.49 12 3.75 3.75m0 0-3.75 3.75m3.75-3.75H3.74V4.499" />
</svg>
`;

const friendsTabs: TabButtons<FriendsListTabs>[] = [
  { tabType: "friends", text: "Все", icon: UsersIcon },
  { tabType: "incoming", text: "Заявки", icon: ArrowUpLeftIcon },
  { tabType: "outgoing", text: "Ваши запросы", icon: ArrowDownRightIcon },
];

export default async function Page(props: { searchParams?: Promise<{ query?: string; filter: FriendsListTabs | "search"; sortBy?: string; order?: string; page?: string }> }) {

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const searchParams = await props.searchParams;

  const query = searchParams?.query || "";
  const tabType = searchParams?.filter || "friends";
  const currentPage = Number(searchParams?.page) || 1;

  const order: SortOrder = (searchParams?.order as SortOrder) || null;
  const sortBy: SortBy | null = (searchParams?.sortBy as SortBy) || null;

  const options: GetFriendsOptions = {
    currentUserId: session.user.id,
    filter: tabType !== "search" ? tabType : "friends",
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
          <PageHeader title={"Друзья"} />

          <div className="h-full flex justify-center items-center">
            <Suspense fallback={<ToggleButtonSkeleton />}>
              <ToggleSearchModeButton />
            </Suspense>

            {/* <ToggleFilterButton
              classNamesCommon={"flex justify-center items-center transition-all duration-200 cursor-pointer"}
              filterType={"filter"}
              filterValue1={"search"}
              classNames1={"text-text-primary bg-surface w-fit px-2 h-10 rounded-lg hover:bg-surface-hover hover:text-text-secondary"}
              filterValue2={"friends"}
              classNames2={"text-text-inverted bg-accent rounded-full w-15 h-15 hover:bg-accent-hover hover:text-text-primary"}>
              {tabType == "search" ? <p className="">Выйти из поиска</p> : <UserPlusIcon className=" w-8 h-8" />}
            </ToggleFilterButton> */}
          </div>
        </div>

        <div className="control-div flex flex-col gap-2">
          <div className="w-full h-10">
            <SearchNavigation placeholder={`${tabType == "search" ? "Введите полный email..." : "Найти друга..."}`} />
          </div>

          {tabType !== "search" && (
            <>
              <div className="flex bg-bg-secondary rounded-md w-full h-10 justify-between">
                <TabButtonsNavigation tabs={friendsTabs} />
              </div>
              <OrderSettingsNavigation />
            </>
          )}
        </div>

        <section className="content-div rounded-md h-full mt-4 flex flex-col gap-3 items-center">
          {tabType == "search" ? (
            <Suspense key={query} fallback={<SeachLoading />}>
              <SearchedNewFriend query={query} />
            </Suspense>
          ) : (
            <Suspense key={options.filter} fallback={<FriendListSkeleton count={5} />}>
              <FriendList filterType={tabType} options={options} />
            </Suspense>
          )}
        </section>
      </main>
    </>
  );
}
