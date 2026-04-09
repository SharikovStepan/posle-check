"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import SearchUI from "./searchUI";

export default function SearchNavigation({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();

  const { replace } = useRouter();
  const pathname = usePathname();

  const currentSearchText = searchParams.get("query")?.toString() || "";

  const handleChangeSearch = (targetText: string) => {
    const params = new URLSearchParams(searchParams);
    if (targetText !== "") {
      params.set("query", targetText);
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    } else {
      params.delete("query");
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  return <SearchUI placeholder={placeholder} searchText={currentSearchText} onSearchChange={handleChangeSearch} />;
}
