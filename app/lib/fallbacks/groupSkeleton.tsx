import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function GroupSkeleton() {
  return (
    <>
      <div className="header-div h-full flex justify-between items-start mb-2">
        <Link href={"/groups"} className="w-15 h-15 rounded-full bg-surface flex justify-center items-center">
          <ArrowLeftIcon className="w-1/2 h-1/2" />
        </Link>
        <div className="flex flex-col gap-2 w-fit items-center">
          <h3 className="shimmer h-15 w-40 rounded-2xl"></h3>
          <div className="shimmer flex gap-2 rounded-lg h-4 w-40"></div>
        </div>

        <div className="h-full flex justify-center items-center">
          <div className="shimmer flex justify-center items-center transition-all duration-200 cursor-pointer text-text-inverted bg-accent rounded-full w-15 h-15 hover:bg-accent-hover hover:text-text-primary"></div>
        </div>
      </div>
      <div className="shimmer flex w-full bg-surface rounded-2xl h-8"></div>
    </>
  );
}
