export default function FriendListSkeleton({ count }: { count: number }) {
  const userCount = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <div className="rounded-md h-full flex flex-col gap-3 items-center w-full">
      {userCount.map((user) => (
        <div className="relative w-full p-2 rounded-2xl bg-surface h-20 flex gap-3 justify-between items-center border border-border shadow-md">
          <div className="h-full flex flex-col justify-between">
            <div className="flex p-1.5 w-full h-full items-center gap-3">
              <div className="shimmer w-13 h-13 rounded-full bg-accent-light opacity-40"></div>
              <p className="shimmer text-text-primary text-lg bg-accent-light w-40 h-5 rounded-md opacity-40"></p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
