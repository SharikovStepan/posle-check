"use client";

import { TabButtons } from "@/app/lib/types/types.filters";
import { Group, GroupPageTabs } from "@/app/lib/types/types.groups";
import { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import GroupdMember from "./GroupMemberCard";
import CheckByUserCard from "../checks/checkCardByUser";
import CheckToUserCard from "../checks/checkCardToUser";
import TabButtonsUI from "../tabButtonsUI";

const tabs: TabButtons<GroupPageTabs>[] = [
  { tabType: "checksByUser", text: "Ваши чеки" },
  { tabType: "checksToUser", text: "На оплату" },
  { tabType: "members", text: "Участники" },
];

export default function GroupDetails({ groupData, currentUserId }: { currentUserId: string; groupData: Group }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [tab, setTab] = useState<GroupPageTabs>(() => {
    const tabParam = searchParams.get("tab") as GroupPageTabs;
    return tabParam && tabs.some((t) => t.tabType === tabParam) ? tabParam : "checksByUser";
  });

  const changeTab = (newTab: GroupPageTabs) => {
    setTab(newTab);

    const params = new URLSearchParams(searchParams);
    params.set("tab", newTab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <div className="flex w-full bg-surface rounded-lg h-8">
        <TabButtonsUI tabs={tabs} currentTab={tab} onTabChange={changeTab} />
      </div>

      <div className="flex flex-col gap-3">
        {tab == "checksByUser" ? (
          groupData.checksByUser.length ? (
            groupData.checksByUser.map((check) => {
              return <CheckByUserCard key={check.id} checkData={check} />;
            })
          ) : (
            <div className="text-lg text-text-primary w-full text-center">Вы не создавали чеки</div>
          )
        ) : tab == "checksToUser" ? (
          groupData.checksToUser.length ? (
            groupData.checksToUser.map((check) => {
              return <CheckToUserCard key={check.id} checkData={check} />;
            })
          ) : (
            <div className="text-lg text-text-primary w-full text-center">Вам не выставляли чеки</div>
          )
        ) : (
          groupData.members.map((member) => {
            return <GroupdMember key={member.id} memberData={member} groupId={groupData.id} currentUserId={currentUserId} />;
          })
        )}
      </div>
    </>
  );
}
