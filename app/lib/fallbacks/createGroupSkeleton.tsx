import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import FriendListSkeleton from "./friendsListSkeleton";
import OrderSettingsSkeleton from "./orderSkeleton";
import SearchSkeleton from "./searchSkeleton";
import BackButton from "@/app/ui/backButton";
import PageHeader from "@/app/ui/pageHeader";

export default function CreateGroupPageSkeleton() {
  return (
    <>
      <main className="flex flex-col gap-3">
        <div className="header-div md:shrink-0 h-full md:h-(--header-height) flex justify-between items-center mb-2">
          <BackButton className="w-15 h-15 rounded-full bg-surface flex justify-center items-center">
            <ArrowLeftIcon className="w-1/2 h-1/2" />
          </BackButton>

          <div className="w-fit text-center">
            <PageHeader title={"Создание группы"} />
          </div>
        </div>

        <div className="h-full">
          <CreateGroupFormSkeleton />
        </div>
      </main>
    </>
  );
}

export function CreateGroupFormSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-3 items-center lg:grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-12">
        <div className="inputs-div w-full lg:row-[1/2] lg:col-[1/2] flex flex-col gap-2">
          <div className="relative h-full mb-4 flex flex-col gap-1">
            <label htmlFor="title" className="block text-lg text-text-primary">
              Название
            </label>
            <div className={`shimmer-dark pointer-events-none mt-1 block w-full h-8 bg-bg-secondary rounded-lg shadow-sm sm:text-sm px-3 focus`}></div>
          </div>

          <div>
            <label htmlFor="description" className="block text-lg text-text-secondary">
              Описание <span className="text-bg-tertiary">(необязательно)</span>
            </label>
            <textarea
              disabled={true}
              name="description"
              id="description"
              rows={5}
              className="shimmer-dark pointer-events-none mt-1 resize-none block w-full bg-bg-secondary rounded-lg border-border shadow-sm sm:text-sm px-3 py-2 focus"
            />
          </div>

          <span className="block w-full bg-surface mt-6 h-0.5 "></span>
        </div>

        <div className="members-div w-full flex flex-col gap-3 mt-4">
          <div className="flex justify-between items-center">
            <p className="text-lg">Добавить друзей</p>
            <p className="shimmer inline-block bg-accent/18 px-4 py-1 rounded-2xl text-accent-light h-8 w-35"></p>
          </div>

          <div className={`shimmer-dark lg:hidden grid grid-cols-[1fr_1fr] bg-surface h-8 w-full rounded-xl`}></div>

          <div className={`block lg:block lg:col-[1/2] row-[2/3] mb-100`}>
            <div className="control-div flex flex-col gap-3 mb-6">
              <div className="h-10">
                {/* <SearchSkeleton /> */}
              </div>
              {/* <OrderSettingsSkeleton /> */}
            </div>
            {/* <FriendListSkeleton count={3} /> */}
          </div>
        </div>
        <div className={`hidden lg:block lg:col-[2/3] row-[1/3] lg:h-full`}></div>
      </div>
    </>
  );
}
