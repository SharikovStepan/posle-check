import { auth } from "@/auth";
import { UserCircleIcon } from "@heroicons/react/16/solid";

export default async function ProfileCard() {
  const session = await auth();

  const name = session?.user.name || "noname";
  const avatar_url = session?.user.image || "";

  return (
    <>
      <div className="flex flex-col gap-1 justify-center items-center mb-4">
        <div className={`relative p-1 rounded-2xl bg-surface h-14 flex gap-3 justify-between items-center border border-border`}>
          <div className="h-full flex flex-col justify-between">
            <div className={` h-full flex items-center gap-3`}>
              {avatar_url ? (
                <div className={`h-12 rounded-full overflow-hidden`}>
                  <img src={avatar_url} alt="user icon" className="w-full h-full object-cover" />
                </div>
              ) : (
                <UserCircleIcon className={`h-12 w-full text-accent/80 overflow-hidden`} />
              )}
            </div>
          </div>
        </div>

        <p className="text-text-tertiary text-xl font-medium">{name}</p>
      </div>
    </>
  );
}
