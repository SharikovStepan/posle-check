"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
const VIVISBLE_NUMBER_BUTTONS_COUNT = 3;

export default function Pagination({ totalPages, currentPage }: { totalPages: number; currentPage: number }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const visibleNumberButtons =
    totalPages <= VIVISBLE_NUMBER_BUTTONS_COUNT
      ? Array.from({ length: totalPages }, (_, i) => i + 1)
      : Array.from({ length: VIVISBLE_NUMBER_BUTTONS_COUNT }, (_, i) => {
          const startNum = currentPage == 1 ? 1 : currentPage == totalPages ? currentPage - VIVISBLE_NUMBER_BUTTONS_COUNT + 1 : currentPage - 1;
          return startNum + i <= totalPages ? startNum + i : startNum;
        });

  const changeCurrentPage = (targetPage: number): void => {
    const params = new URLSearchParams(searchParams);
    params.set("page", targetPage.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="flex gap-2">
        {totalPages > VIVISBLE_NUMBER_BUTTONS_COUNT && (
          <button
            onClick={() => changeCurrentPage(currentPage - 1)}
            disabled={currentPage == 1}
            className={`${
              currentPage == 1 ? "pointer-events-none opacity-55" : ""
            } cursor-pointer border border-violet-500 rounded-sm w-6 h-8 flex justify-center items-center hover:bg-indigo-velvet-400 bg-indigo-velvet-200`}>
            <ArrowLeftIcon className="text-grey-olive-800 w-4 h-4" />
          </button>
        )}

        <div className="flex gap-1">
          {visibleNumberButtons.map((buttonNum, index) => (
            <button
              onClick={() => changeCurrentPage(buttonNum)}
              className={`${
                currentPage == buttonNum ? "bg-indigo-velvet-500 text-grey-olive-200 pointer-events-none" : "hover:bg-indigo-velvet-400 bg-indigo-velvet-200"
              } cursor-pointer border border-violet-500 rounded-sm w-8 h-8 flex justify-center items-center`}
              key={`pagination-button-${buttonNum}-${index}`}>
              <p>{buttonNum}</p>
            </button>
          ))}
        </div>

        {totalPages > VIVISBLE_NUMBER_BUTTONS_COUNT && (
          <button
            onClick={() => changeCurrentPage(currentPage + 1)}
            disabled={currentPage == totalPages}
            className={`${
              currentPage == totalPages ? "pointer-events-none opacity-55" : ""
            } cursor-pointer border border-violet-500 rounded-sm w-6 h-8 flex justify-center items-center hover:bg-indigo-velvet-400 bg-indigo-velvet-200`}>
            <ArrowRightIcon className="text-grey-olive-800 w-4 h-4" />
          </button>
        )}
      </div>
    </>
  );
}
