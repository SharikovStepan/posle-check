"use client";

import { FilterButton } from "@/app/lib/types/types.filters";
import { Group, GroupPageTabs } from "@/app/lib/types/types.groups";
import { useState } from "react";
import TabChangeButton from "../tabChangeButtons";
import CheckCard from "../checks/checkCard";
import GroupdMember from "./GroupMemberCard";

const tabs: FilterButton<GroupPageTabs>[] = [
  { filterType: "checks", text: "Чеки" },
  { filterType: "members", text: "Участники" },
];

export default function GroupDetails({ groupData }: { groupData: Group }) {
  const [tab, setTab] = useState<"checks" | "members">("checks");

  return (
    <>
      <div className="flex w-full bg-surface rounded-2xl h-8">
        <TabChangeButton tabs={tabs} currentTab={tab} changeTab={setTab} />
      </div>

      <div className="flex flex-col gap-3">
        {tab == "checks"
          ? groupData.checks.map((check) => {
              return <CheckCard key={check.id} checkData={check} />;
            })
          : groupData.members.map((member) => {
              return <GroupdMember key={member.id} memberData={member} />;
            })}
      </div>
    </>
  );
}
