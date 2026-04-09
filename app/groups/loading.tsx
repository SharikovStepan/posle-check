export default function Loading() {
  return (
    <>
      <main className="main-div">
        <div>LOADING GROUPS</div>
        {/* <div className="header-div h-full flex justify-between items-center">
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
            <Suspense fallback={<SearchSkeleton />}>
              <SearchNavigation placeholder={`Введите название...`} />
            </Suspense>
          </div>

          <>
            <div className="flex bg-bg-secondary rounded-md w-full h-10 justify-between ">
              <Suspense fallback={<div className="shimmer w-full h-full"></div>}>
                <TabButtonsNavigation tabs={friendsFilters} />
              </Suspense>
            </div>
            <Suspense fallback={<OrderSettingsSkeleton />}>
              <OrderSettingsNavigation />
            </Suspense>
          </>
        </div>

        <section className="content-div rounded-md h-full mt-4 flex flex-col gap-3 items-center">
          <Suspense fallback={<GroupsListSkeleton count={5} />}>
            <GroupsListData searchParamsPromise={props.searchParams} />
          </Suspense>
        </section> */}
      </main>
    </>
  );
}
