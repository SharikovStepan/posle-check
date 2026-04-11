import BackButton from "@/app/ui/backButton";
import PageHeader from "@/app/ui/pageHeader";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function CheckPageSkeleton() {
  return (
    <>
      <div className="flex flex-col md:grid md:grid-rows-[100_auto] gap-3 w-full">
        <CheckDetailsSkeleton />
      </div>
    </>
  );
}

export function CheckDetailsSkeleton() {
  return (
    <>
      <div className="header-div md:shrink-0 h-(--header-height) flex justify-between gap-4 items-start md:items-center mb-2">
        <BackButton className="cursor-pointer w-15 h-15 rounded-full bg-surface flex justify-center items-center">
          <ArrowLeftIcon className="w-1/2 h-1/2" />
        </BackButton>

        <div className="flex flex-col gap-2 w-fit items-center self-start">
          <div className="shimmer h-15 w-35 rounded-xl text-text-secondary text-3xl flex justify-center items-center"></div>
          <div className="flex gap-2 text-xs text-text-tertiary items-center ">
            <p className="shimmer h-4 w-35 rounded-md">{""}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 items-center text-text-primary w-full justify-center text-2xl">
          <p className="font-light text-text-tertiary text-base tracking-wide">Сумма чека</p>
          <p className="shimmer tracking-wide relative h-8 w-20 rounded-md"></p>
        </div>
        <span className="block w-full bg-surface mt-6 h-0.5 "></span>
      </div>
    </>
  );
}
