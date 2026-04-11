import ProfileCardSkeleton from "../lib/fallbacks/profileCardSkeleton";
import PageHeader from "../ui/pageHeader";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col md:grid md:grid-rows-[100_auto] gap-3 w-full">
        <PageHeader title={"Профиль"} />
        <div className="rounded-md h-full p-3 bg-bg-secondary flex flex-col justify-center items-center gap-3">
          <div className="flex flex-col gap-2 justify-center items-center">
            <ProfileCardSkeleton />
            <h3 className="shimmer-dark text-text-primary text-lg text-center h-6 rounded-md w-78"></h3>
            <p className="shimmer-dark text-text-tertiary/80 text-sm h-5 rounded-md w-45"></p>
          </div>
          <div className="shimmer-dark h-10 w-34 rounded-xl"></div>

          <div className="shimmer-dark h-9 w-34 rounded-xl"></div>
        </div>
      </div>
    </>
  );
}
