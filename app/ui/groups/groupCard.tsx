"use client";

import { GroupCardType } from "@/app/lib/types/types.groups";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/outline";

import { UserGroupIcon as UserGroupIconMicro, DocumentCurrencyDollarIcon } from "@heroicons/react/16/solid";
import AvatarsRow from "./avatarsRow";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function GroupCard({ groupData }: { groupData: GroupCardType }) {

  return (
    <>
      <Link href={`/groups/${groupData.id}`} className="block hover:border-border-focus border border-surface cursor-pointer transition-all duration-200 focus rounded-2xl">
        <article className="w-full rounded-2xl bg-surface p-4 grid grid-rows-[2fr_1fr_0.5fr] grid-cols-[2fr_1fr] gap-y-2 ">
          <div className="h-14 w-14 bg-accent/30 flex justify-center items-center rounded-xl ">
            {groupData.icon_url !== null ? (
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <img src={groupData.icon_url} alt="group icon" className="w-full h-full object-cover" />
              </div>
            ) : (
              <UserGroupIcon className="w-10 h-10" />
            )}
          </div>

          <div className="flex col-[2/3] justify-self-end">
            <AvatarsRow avatars={groupData.avatars} memberCount={groupData.members_count} />
          </div>

          <h4 className="text-text-primary font-bold text-lg row-[2/3] col-[1/2] text-nowrap">{groupData.title}</h4>

          <div className="flex justify-center items-center gap-4 col-[1/3] row-[3/4] justify-self-start">
            <div className="flex justify-center items-center gap-1 text-text-tertiary">
              <UserGroupIconMicro className="h-5 w-5" />
              <p>{groupData.members_count}</p>
              <p className="text-sm">Участников</p>
            </div>

            <div className="flex justify-center items-center gap-1 text-text-tertiary">
              <DocumentCurrencyDollarIcon className="h-5 w-5" />
              <p>{groupData.checks_count}</p>
              <p className="text-sm">Чеков</p>
            </div>
          </div>
        </article>
      </Link>
    </>
  );
}
