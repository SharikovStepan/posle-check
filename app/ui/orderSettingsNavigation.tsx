"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import { BarsArrowDownIcon, BarsArrowUpIcon } from "@heroicons/react/20/solid";
import { SortBy, SortOrder } from "../lib/types/types.filters";
import OrderSettingsUI from "./orderSettingsUI";

export default function OrderSettingsNavigation() {
  const searchParams = useSearchParams();

  const sortBy = (searchParams.get("sortBy")?.toString() as SortBy) || "date";
  const sortOrder = (searchParams.get("order")?.toString() as SortOrder) || "asc";

  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSortChange = (targetSort: SortBy) => {
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", targetSort);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleOrderChange = (targetOrder: SortOrder) => {
    const params = new URLSearchParams(searchParams);
    params.set("order", targetOrder);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  //   const debounceTmr = useRef<NodeJS.Timeout | null>(null);

  //   useEffect(() => {
  //     if (isFirstRender.current) {
  //       isFirstRender.current = false;
  //       return;
  //     }

  //     if (debounceTmr.current) {
  //       clearTimeout(debounceTmr.current);
  //     }

  //     const params = new URLSearchParams(searchParams);
  //     params.set("order", order);
  //     params.set("sortBy", sortBy);

  //     debounceTmr.current = setTimeout(() => {
  //       if (mode == "navigation") {
  //         replace(`${pathname}?${params.toString()}`, { scroll: false });
  //       } else if (mode == "state" && onOrderChange) {
  //         onOrderChange(sortBy, order);
  //       }
  //     }, 100);

  //     return () => {
  //       if (debounceTmr.current) {
  //         clearTimeout(debounceTmr.current);
  //       }
  //     };
  //   }, [order, sortBy]);

  return <OrderSettingsUI sortBy={sortBy} sortOrder={sortOrder} onSortByChange={handleSortChange} onOrderChange={handleOrderChange} />;
}
