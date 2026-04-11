"use client";

import { TabButtons } from "@/app/lib/types/types.filters";
import { Group, GroupMemberCard, GroupPageTabs } from "@/app/lib/types/types.groups";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import GroupdMember from "./GroupMemberCard";
import CheckByUserCard from "../checks/checkCardByUser";
import CheckToUserCard from "../checks/checkCardToUser";
import TabButtonsUI from "../tabButtonsUI";
import { CheckByUserCardType, CheckToUserCardType } from "@/app/lib/types/types.checks";
import { AnimatePresence, motion } from "motion/react";

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

      <AnimatePresence mode="wait">
        {tab == "checksByUser" && (
          <motion.div key={tab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="will-change-transform flex flex-col gap-3">
            <ChecksByUserList checksList={groupData.checksByUser} />
          </motion.div>
        )}

        {tab == "checksToUser" && (
          <motion.div key={tab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="will-change-transform flex flex-col gap-3">
            <ChecksToUserList checksList={groupData.checksToUser} />
          </motion.div>
        )}

        {tab == "members" && (
          <motion.div key={tab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="will-change-transform flex flex-col gap-3">
            <GroupMembersList membersList={groupData.members} groupId={groupData.id} currentUserId={currentUserId} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function ChecksByUserList({ checksList }: { checksList: CheckByUserCardType[] }) {
  if (checksList.length > 0) {
    return checksList.map((check) => <CheckByUserCard key={check.id} checkData={check} />);
  } else {
    return <div className="text-lg text-text-primary w-full text-center">Вы не создавали чеки</div>;
  }
}

export function ChecksToUserList({ checksList }: { checksList: CheckToUserCardType[] }) {
  if (checksList.length > 0) {
    return checksList.map((check) => <CheckToUserCard key={check.id} checkData={check} />);
  } else {
    return <div className="text-lg text-text-primary w-full text-center">Вам не выставляли чеки</div>;
  }
}

export function GroupMembersList({ membersList, groupId, currentUserId }: { membersList: GroupMemberCard[]; groupId: string; currentUserId: string }) {
  if (membersList.length) {
    return membersList.map((member) => <GroupdMember key={member.id} memberData={member} groupId={groupId} currentUserId={currentUserId} />);
  } else {
    return <div className="text-lg text-text-primary w-full text-center">Нет участников</div>;
  }
}
