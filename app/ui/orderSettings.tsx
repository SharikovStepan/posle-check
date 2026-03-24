"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BarsArrowDownIcon, BarsArrowUpIcon } from "@heroicons/react/20/solid";
import { SortBy, SortOrder } from "../lib/types/types.filters";

export default function OrderSettings() {
  const searchParams = useSearchParams();

  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [order, setOrder] = useState<SortOrder>("asc");

  const pathname = usePathname();
  const { replace } = useRouter();

  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set("order", order);
    params.set("sortBy", sortBy);
    console.log("Replace!!! SORTS");

    replace(`${pathname}?${params.toString()}`);
  }, [order, sortBy]);

  return (
<div className="flex gap-1">
  <div className="relative">
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value as SortBy)}
      className="
        h-full w-25
        px-1.5
        flex justify-start items-center
        appearance-none
        bg-surface
        border border-border
        rounded-md
        cursor-pointer
        font-medium
        text-foreground
        hover:bg-surface-strong
        focus:border-primary
        shadow-sm
        transition-all duration-200
      ">
      <option value="date" className="py-2">По дате</option>
      <option value="name" className="py-2">По имени</option>
    </select>

    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-0.5 text-muted-foreground">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>

  <button
    onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
    className="
      bg-surface
      text-foreground
      border border-border
      rounded-md
      hover:bg-surface-strong
      font-medium
      flex
      items-center
      gap-1
      h-full
      cursor-pointer
      shadow-sm
      transition-all duration-200
    ">
    {order === "asc" ? (
      <BarsArrowUpIcon className="w-8 h-2/3 text-muted-foreground" />
    ) : (
      <BarsArrowDownIcon className="w-8 h-2/3 text-muted-foreground" />
    )}
  </button>
</div>
  );
}
