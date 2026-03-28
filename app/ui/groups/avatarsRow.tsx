import { UserIcon } from "@heroicons/react/16/solid";

export default function AvatarsRow({ avatars, memberCount }: { avatars: (string | null)[]; memberCount: number }) {
  const extraCount = memberCount - avatars.length;

  const shouldShowExtra = extraCount > 0;

  return (
    <>
      {avatars.map((userAvatar, index) => {
        const isLast = index === avatars.length - 1;

        const url = userAvatar && userAvatar !== "NULL" ? userAvatar : null;

        const baseClasses = `
			  ${index !== 0 ? "-ml-2" : ""}
			  w-10 h-10 rounded-full border-2 border-border
			  flex items-center justify-center overflow-hidden
			`;

        if (isLast && shouldShowExtra) {
          return (
            <div key={`${"icon"}-${index}`} className={`${baseClasses} bg-surface-hover text-sm font-medium flex justify-center items-center`}>
              <div className="flex justify-center items-center -translate-0.5">
                <p className="">+</p>
                <p>{extraCount + 1}</p>
              </div>
            </div>
          );
        }

        if (url) {
          return (
            <div key={`${"icon"}-${index}`} className={baseClasses}>
              <img src={url} alt="member icon" className="w-full h-full object-cover" />
            </div>
          );
        }

        return <UserIcon key={`${"icon"}-${index}`} className={`${baseClasses} bg-accent p-1.5`} />;
      })}
    </>
  );
}
