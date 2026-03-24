"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export type FilterButton<T extends string> = { filterType: T; text: string; icon: any };

export default function FilterButtons<T extends string>({ filters }: { filters: FilterButton<T>[] }) {
  const searchParams = useSearchParams();

  const [filterState, setFilterState] = useState<T>((searchParams.get("filter") as T) || filters[0].filterType);
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("filter", filterState);
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  }, [filterState]);

  return (
    <>
      {filters.map((filter) => {
        const ButtonIcon = filter.icon;
        return (
          <button
            key={filter.filterType}
            disabled={filterState === filter.filterType}
            onClick={() => setFilterState(filter.filterType)}
            className={`${
              filterState === filter.filterType ? "bg-indigo-velvet-500 text-grey-olive-100 pointer-events-none" : "text-indigo-velvet-600 hover:bg-indigo-velvet-300"
            } button button-filter`}>
            <div>
              <div className="md:hidden w-10 flex justify-center items-center" dangerouslySetInnerHTML={{ __html: filter.icon }} />

              <p className="hidden md:block">{filter.text}</p>
            </div>
          </button>
        );
      })}
    </>
  );
}
