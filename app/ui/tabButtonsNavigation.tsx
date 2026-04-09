"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { TabButtons } from "../lib/types/types.filters";
import TabButtonsUI from "./tabButtonsUI";

export default function TabButtonsNavigation<T extends string>({ tabs }: { tabs: TabButtons<T>[] }) {
  const searchParams = useSearchParams();

  const pathname = usePathname();
  const { replace } = useRouter();

  const currentTab = (searchParams.get("filter") as T) || tabs[0].tabType;

  const handleChangeTab = (targetTab: T) => {
    const params = new URLSearchParams(searchParams);

    params.set("filter", targetTab);
    params.delete("page");

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <TabButtonsUI tabs={tabs} currentTab={currentTab} onTabChange={handleChangeTab} />
    </>
  );
}
