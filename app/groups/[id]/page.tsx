import { getGroupDetails } from "@/app/lib/data/data.groups";
import GroupSkeleton from "@/app/lib/fallbacks/groupSkeleton";
import GroupPage from "@/app/ui/groups/groupPage";
import PageHeader from "@/app/ui/pageHeader";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Suspense } from "react";
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Группа',
 };

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  return (
    <>
      <main className="main-div">

        <Suspense fallback={<GroupSkeleton />}>
          <GroupPage id={id} />
        </Suspense>
      </main>
    </>
  );
}
