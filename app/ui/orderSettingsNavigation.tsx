"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
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

  return <OrderSettingsUI sortBy={sortBy} sortOrder={sortOrder} onSortByChange={handleSortChange} onOrderChange={handleOrderChange} />;
}
