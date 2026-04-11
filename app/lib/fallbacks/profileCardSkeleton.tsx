import { UserCircleIcon } from "@heroicons/react/16/solid";

export default function ProfileCardSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-1 justify-center items-center mb-4">
        <div className={`relative p-1 rounded-2xl bg-surface h-14 flex gap-3 justify-between items-center border border-border`}>
          <div className="h-full flex flex-col justify-between">
            <div className={`shimmer rounded-full h-full flex items-center gap-3`}>
              <UserCircleIcon className={`h-12 w-12 text-accent/80 overflow-hidden`} />
            </div>
          </div>
        </div>

        <p className="shimmer w-40 rounded-2xl h-7 text-text-tertiary text-xl font-medium">{}</p>
      </div>
    </>
  );
}
