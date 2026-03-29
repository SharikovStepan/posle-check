"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FilterButton } from "../lib/types/types.filters";

// export type FilterButton<T extends string> = { filterType: T; text: string; icon?: any };

export default function FilterButtons<T extends string>({ filters }: { filters: FilterButton<T>[] }) {
  const searchParams = useSearchParams();

  const [filterState, setFilterState] = useState<T>((searchParams.get("filter") as T) || filters[0].filterType);
  const pathname = usePathname();
  const { replace } = useRouter();

  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const params = new URLSearchParams(searchParams);

    params.set("filter", filterState);
    params.delete("page");

    replace(`${pathname}?${params.toString()}`);
  }, [filterState]);

  return (
    <>
      {filters.map((filter) => {
        return (
          <button
            key={filter.filterType}
            disabled={filterState === filter.filterType}
            onClick={() => setFilterState(filter.filterType)}
            className={`${
              filterState === filter.filterType ? " bg-accent text-text-inverted pointer-events-none shadow-sm" : "bg-surface text-text-tertiary hover:bg-surface-hover"
            } cursor-pointer w-full h-full rounded-lg transition-all duration-200 focus`}>
            <div className="flex items-center justify-center gap-1">
              {filter.icon && <div className="w-fit flex justify-center items-center" dangerouslySetInnerHTML={{ __html: filter.icon }} />}

              <p className="hidden md:block text-xs md:text-md">{filter.text}</p>
            </div>
          </button>
        );
      })}
    </>
  );
}
