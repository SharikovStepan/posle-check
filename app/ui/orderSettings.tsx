"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import { BarsArrowDownIcon, BarsArrowUpIcon } from "@heroicons/react/20/solid";
import { SortBy, SortOrder } from "../lib/types/types.filters";

export default function OrderSettings({ mode = "navigation", onOrderChange }: { mode?: "navigation" | "state"; onOrderChange?: (sortBy: SortBy, order: SortOrder) => void }) {
  const searchParams = useSearchParams();

  const [sortBy, setSortBy] = useState<SortBy>((searchParams.get("sortBy")?.toString() as SortBy) || "date");
  const [order, setOrder] = useState<SortOrder>((searchParams.get("order")?.toString() as SortOrder) || "asc");

  const pathname = usePathname();
  const { replace } = useRouter();

  const isFirstRender = useRef<boolean>(true);

  const debounceTmr = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (debounceTmr.current) {
      clearTimeout(debounceTmr.current);
    }

    const params = new URLSearchParams(searchParams);
    params.set("order", order);
    params.set("sortBy", sortBy);

    debounceTmr.current = setTimeout(() => {
      if (mode == "navigation") {
        replace(`${pathname}?${params.toString()}`, { scroll: false });
      } else if (mode == "state" && onOrderChange) {
        onOrderChange(sortBy, order);
      }
    }, 100);

    return () => {
      if (debounceTmr.current) {
        clearTimeout(debounceTmr.current);
      }
    };
  }, [order, sortBy]);

  return (
    <div className="flex gap-2 h-10 w-full">
      <div className="relative w-full">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="
        h-full w-full
        px-2
        flex justify-start items-center
        appearance-none
        bg-surface
        border border-border
        rounded-md
        cursor-pointer
        font-medium
        text-text-primary
        hover:bg-surface-hover
        focus
        shadow-sm
        transition-all duration-200
      ">
          <option value="date" className="py-2 w-full">
            По дате
          </option>
          <option value="name" className="py-2">
            По имени
          </option>
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-0.5 text-muted-foreground">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
        className="
		  w-10
      bg-surface
      text-foreground
      border border-border
      rounded-md
      hover:bg-surface-hover
		focus
      font-medium
      flex
      items-center
      gap-1
      h-full
      cursor-pointer
      shadow-sm
      transition-all duration-200
    ">
        {order === "asc" ? <BarsArrowUpIcon className="w-8 h-2/3 text-muted-foreground" /> : <BarsArrowDownIcon className="w-8 h-2/3 text-muted-foreground" />}
      </button>
    </div>
  );
}
