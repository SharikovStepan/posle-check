"use client";

import { FilterButton } from "@/app/lib/types/types.filters";
import { Group, GroupPageTabs } from "@/app/lib/types/types.groups";
import { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import TabChangeButton from "../tabChangeButtons";
import GroupdMember from "./GroupMemberCard";
import CheckByUserCard from "../checks/checkCardByUser";
import CheckToUserCard from "../checks/checkCardToUser";

const tabs: FilterButton<GroupPageTabs>[] = [
  { filterType: "checksByUser", text: "Ваши чеки" },
  { filterType: "checksToUser", text: "На оплату" },
  { filterType: "members", text: "Участники" },
];

export default function GroupDetails({ groupData }: { groupData: Group }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [tab, setTab] = useState<GroupPageTabs>(() => {
    const tabParam = searchParams.get("tab") as GroupPageTabs;
    return tabParam && tabs.some((t) => t.filterType === tabParam) ? tabParam : "checksByUser";
  });

  const changeTab = (newTab: GroupPageTabs) => {
    setTab(newTab);

    const params = new URLSearchParams(searchParams);
    params.set("tab", newTab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <div className="flex w-full bg-surface rounded-2xl h-8">
        <TabChangeButton tabs={tabs} currentTab={tab} changeTab={changeTab} />
      </div>

      <div className="flex flex-col gap-3">
        {tab == "checksByUser"
          ? groupData.checksByUser.map((check) => {
              return <CheckByUserCard key={check.id} checkData={check} />;
            })
          : tab == "checksToUser"
          ? groupData.checksToUser.map((check) => {
              return <CheckToUserCard key={check.id} checkData={check} />;
            })
          : groupData.members.map((member) => {
              return <GroupdMember key={member.id} memberData={member} />;
            })}
      </div>
    </>
  );
}
