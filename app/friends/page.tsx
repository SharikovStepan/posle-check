import { FriendsListResult, getFriendsList, searchUserByEmail } from "../lib/data/data.friendship";
import { PROFILE_UUID } from "../lib/placeholders-data";
import FriendList from "../ui/friends/friendList";
import PageHeader from "../ui/pageHeader";
import Search from "../ui/search";
import UserCard from "../ui/friends/userCard";
import Pagination from "../ui/paginaton";
import OrderSettings from "../ui/orderSettings";
import SingleSearchParamButton from "../ui/friends/singleSearchParamButton";
import EmptyNotification from "../ui/friends/emptyNotification";
import { FilterButton, FriendsFilter, SortBy, SortOrder } from "../lib/types/types.filters";
import { GetFriendsOptions } from "../lib/types/types.friends";
import FilterButtons from "../ui/friends/filterButtons";

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

const friendsFilters: FilterButton<FriendsFilter>[] = [
  { filterType: "friends", text: "Все", icon: UsersIcon },
  { filterType: "incoming", text: "Входящие", icon: ArrowUpLeftIcon },
  { filterType: "outgoing", text: "Исходящие", icon: ArrowDownRightIcon },
];

export default async function Page(props: { searchParams?: Promise<{ query?: string; filter: FriendsFilter; sortBy?: string; order?: string; page?: string }> }) {
  const searchParams = await props.searchParams;

  const query = searchParams?.query || "";
  const filterType = searchParams?.filter || "friends";
  const currentPage = Number(searchParams?.page) || 1;

  const order = searchParams?.order || null;
  const sortBy = searchParams?.sortBy || null;

  const options: GetFriendsOptions = {
    currentUserId: PROFILE_UUID,
    filter: filterType !== "search" ? filterType : "friends",
    currentPage: currentPage,
    search: query,
    ...(order && ({ order } as { order: SortOrder })),
    ...(sortBy && ({ sortBy } as { sortBy: SortBy })),
  };

  const searchedUser = query && filterType == "search" ? await searchUserByEmail(PROFILE_UUID, query) : null;

  const friendsListResult: FriendsListResult = await getFriendsList(options);

  return (
    <>
    <div className="flex flex-col md:grid md:grid-rows-[100_auto] gap-3 w-full">
  <PageHeader title={"Друзья"} />
  <div className="rounded-md h-full p-3 bg-surface-elevated border border-border shadow-card flex flex-col gap-3 items-center jus">
    <div className="w-full h-10 flex justify-between gap-2">
      <Search placeholder={`${filterType == "search" ? "Введите полный email..." : "Найти друга..."}`} />
      <SingleSearchParamButton filterType={"filter"} filterValue={"search"} icon={""} text={"Добавить..."} />
    </div>

    {filterType !== "search" ? (
      <div className="flex justify-between w-full gap-1">
        <div className="flex justify-between gap-1 lg:gap-3">
          <FilterButtons filters={friendsFilters} />
        </div>
        <OrderSettings />
      </div>
    ) : (
      <div className="w-full flex justify-end">
        <SingleSearchParamButton filterType={"filter"} filterValue={"friends"} icon={""} text={"Выйти из поиска"} />
      </div>
    )}

    <div className="flex flex-col gap-3 grow w-full">
      {filterType == "search" ? (
        searchedUser ? (
          <UserCard userData={searchedUser} friendshipId={searchedUser.friendship_id} />
        ) : (
          <EmptyNotification>Не найдено</EmptyNotification>
        )
      ) : (
        <FriendList filterType={filterType} usersData={friendsListResult.users} />
      )}
    </div>

    <div className={`${friendsListResult.totalPages == 1 ? "hidden" : "block "}`}>
      <Pagination totalPages={friendsListResult.totalPages} currentPage={currentPage} />
    </div>
  </div>
</div>
    </>
  );
}
