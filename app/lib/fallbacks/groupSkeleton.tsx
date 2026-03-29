import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function GroupSkeleton() {
  return (
    <>
      <div className="header-div h-21 flex justify-start gap-4 items-center mb-2">
        <Link href={"/groups"} className="w-15 h-15 rounded-full bg-surface flex justify-center items-center">
          <ArrowLeftIcon className="w-1/2 h-1/2" />
        </Link>
        <div className="flex flex-col gap-2 w-fit items-center self-start">
          <h3 className="shimmer h-15 w-40 rounded-2xl self-start"></h3>
          <div className="shimmer flex gap-2 self-start rounded-lg h-4 w-30"></div>
        </div>

		  
      </div>
		<div className="shimmer flex w-full bg-surface rounded-2xl h-8"></div>
    </>
  );
}
