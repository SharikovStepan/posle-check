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
    filterState === filter.filterType
      ? "bg-primary text-primary-foreground pointer-events-none shadow-sm"
      : "bg-surface text-foreground hover:bg-surface-strong hover:shadow-sm"
  } button button-filter transition-all duration-200`}>
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
