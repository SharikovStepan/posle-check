import { getGroupDetails } from "@/app/lib/data/data.groups";
import PageHeader from "../pageHeader";
import { ArrowLeftIcon, DocumentPlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import GroupDetails from "./groupDetails";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function GroupPage({ pageParams }: { pageParams: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await pageParams;
  const id = params.id;

  
  const groupDetails = await getGroupDetails(id, session.user.id);

  return (
    <>
      <div className="header-div h-full flex justify-between items-start md:items-center mb-2">
        <Link href={"/groups"} className="w-15 h-15 shrink-0 rounded-full bg-surface flex justify-center items-center">
          <ArrowLeftIcon className="w-1/2 h-1/2" />
        </Link>
        <div className="flex flex-col gap-2 w-fit items-center justify-center text-center">
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

        <div className="h-full flex justify-center items-center shrink-0">
          <Link
            href={`/groups/${id}/create-check`}
            className="flex justify-center items-center transition-all duration-200 cursor-pointer text-text-inverted bg-accent rounded-full w-15 h-15 hover:bg-accent-hover hover:text-text-primary">
            <DocumentPlusIcon className="w-1/2 h-1/2" />
          </Link>
        </div>
      </div>


      <GroupDetails currentUserId={session.user.id} groupData={groupDetails} />
    </>
  );
}
