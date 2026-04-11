
export default function GroupsListSkeleton({ count }: { count: number }) {
  const groupCount = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <>
      {groupCount.map((group, index) => {
        return (
          <div key={`${group}-${index}`} className="block border border-transparent rounded-2xl w-full">
            <article className="w-full rounded-2xl bg-surface p-4 grid grid-rows-[2fr_1fr_0.5fr] grid-cols-[2fr_1fr] gap-y-2 ">
              <div className="shimmer h-14 w-14 bg-accent/30 flex justify-center items-center rounded-xl ">{/* <UserGroupIcon className="w-10 h-10" /> */}</div>

              <div className="flex col-[2/3] justify-self-end">
                <div className={`shimmer w-10 h-10 rounded-full border-2 border-border overflow-hidden bg-surface-hover text-sm font-medium flex justify-center items-center`}></div>
                <div className={`-ml-2 shimmer w-10 h-10 rounded-full border-2 border-border overflow-hidden bg-surface-hover text-sm font-medium flex justify-center items-center`}></div>
                <div className={`-ml-2 shimmer w-10 h-10 rounded-full border-2 border-border overflow-hidden bg-surface-hover text-sm font-medium flex justify-center items-center`}></div>
              </div>

              <h4 className="shimmer rounded-lg w-30 row-[2/3] col-[1/2]"></h4>

              <div className="shimmer w-55 rounded-lg h-6 flex justify-center items-center gap-4 col-[1/3] row-[3/4]"></div>
            </article>
          </div>
        );
      })}
    </>
  );
}
