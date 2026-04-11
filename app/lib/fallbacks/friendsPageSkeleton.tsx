import PageHeader from "@/app/ui/pageHeader";
import SearchSkeleton from "./searchSkeleton";
import FriendListSkeleton from "./friendsListSkeleton";
import OrderSettingsSkeleton from "./orderSkeleton";

export default function FriendsPageSkeleton() {
  return (
    <>
      <main className="main-div">
        <div className="header-div h-full flex justify-between items-center">
          <PageHeader title={"Друзья"} />

          <div className="h-full flex justify-center items-center">
            <div className="shimmer flex justify-center items-center pointer-events-none text-text-inverted bg-accent rounded-full w-15 h-15 hover:bg-accent-hover hover:text-text-primary">
              {/* <PlusIcon className=" w-1/2 h-1/2" /> */}
            </div>
          </div>
        </div>

        <div className="control-div flex flex-col gap-2">
          <div className="w-full h-10">
            <SearchSkeleton />
          </div>

          <div className="shimmer-dark flex bg-bg-secondary rounded-md w-full h-10 justify-between"></div>
          <OrderSettingsSkeleton />
        </div>

        <section className="content-div rounded-md h-full mt-4 flex flex-col gap-3 items-center">
          <FriendListSkeleton count={5} />
        </section>
      </main>
    </>
  );
}
