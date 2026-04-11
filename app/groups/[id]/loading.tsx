import GroupSkeleton from "@/app/lib/fallbacks/groupSkeleton";

export default function Loading() {
  return (
    <>
      <main className="main-div">
        <GroupSkeleton />
      </main>
    </>
  );
}
