import { getGroupDetails } from "@/app/lib/data/data.groups";
import { PROFILE_UUID } from "@/app/lib/placeholders-data";
import PageHeader from "../pageHeader";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import GroupDetails from "./groupDetails";

export default async function GroupPage({ id }: { id: string }) {
  const groupDetails = await getGroupDetails(id, PROFILE_UUID);

  console.log(groupDetails);
  

  return (
    <>
      <div className="header-div h-21 flex justify-start gap-4 items-center mb-2">
        <Link href={"/groups"} className="w-15 h-15 rounded-full bg-surface flex justify-center items-center">
          <ArrowLeftIcon className="w-1/2 h-1/2" />
        </Link>
        <div className="flex flex-col gap-2 w-fit items-center self-start">
          <PageHeader title={groupDetails.title} />

          <div className="flex gap-2 text-xs text-text-tertiary items-center">
            <p className="">
              <span className="font-bold">{groupDetails.members_count}</span> Участника
            </p>
            <span className="inline-block bg-text-tertiary h-1 w-1 rounded-full"></span>
            <p>
              <span className="font-bold">{groupDetails.checks_count}</span> Чеков
            </p>
          </div>
        </div>
      </div>


      <GroupDetails groupData={groupDetails} />
    </>
  );
}
