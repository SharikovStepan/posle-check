"use client";

import { FilterButton } from "@/app/lib/types/types.filters";
import { Group, GroupPageTabs } from "@/app/lib/types/types.groups";
import { useState } from "react";
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
  const [tab, setTab] = useState<GroupPageTabs>("checksByUser");

  return (
    <>
      <div className="flex w-full bg-surface rounded-2xl h-8">
        <TabChangeButton tabs={tabs} currentTab={tab} changeTab={setTab} />
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
