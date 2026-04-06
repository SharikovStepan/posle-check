import { GroupCardType } from "@/app/lib/types/types.groups";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/outline";

import ActionInviteButton from "./actionInviteButton";

export default function InviteGroupCard({ currentUserId, groupData }: { currentUserId: string; groupData: GroupCardType }) {

  return (
    <>
      <div className="block hover:border-border-focus border border-surface cursor-pointer transition-all duration-200 focus rounded-2xl">
        <article className="w-full rounded-2xl bg-surface p-4 grid grid-rows-[2fr_1fr_0.5fr] grid-cols-[1fr_1fr] gap-y-2 ">
          <div className="w-full py-0.5 flex flex-col items-start rounded-xl col-[1/3]">
            <div className="flex gap-2 justify-start items-center">
              <div className={`h-8 w-8  flex items-center gap-3`}>
                {groupData.created_by.avatar_url ? (
                  <div className={`h-full w-full rounded-full overflow-hidden`}>
                    <img src={groupData.created_by.avatar_url} alt="group icon" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <UserCircleIcon className={`"h-full w-full text-accent/80 overflow-hidden`} />
                )}
              </div>
              <p className="w-fit">{groupData.created_by.full_name || groupData.created_by.username}</p>
            </div>
            <p className="text-xs text-text-tertiary/80">Приглашает вас в группу</p>
          </div>

          {/* <div className="flex col-[1/3] justify-self-end"></div> */}

          <h4 className="text-text-primary font-bold text-lg row-[2/3] col-[1/3]">{groupData.title}</h4>

          <div className="flex justify-start w-full items-center gap-5 col-[1/3] row-[3/4] justify-self-start">
            <div className="flex justify-center items-center gap-1 text-text-tertiary">
              <ActionInviteButton action="decline" groupId={groupData.id} memberId={currentUserId} className="cursor-pointer px-2 py-0.5 bg-error text-text-primary rounded-md text-sm w-23 h-6">
                Отклонить
              </ActionInviteButton>
            </div>

            <div className="flex justify-center items-center gap-1 text-text-tertiary">
              <ActionInviteButton action="accept" groupId={groupData.id} memberId={currentUserId} className="cursor-pointer px-2 py-0.5 bg-accent text-text-inverted rounded-md text-sm w-23 h-6">
                Принять
              </ActionInviteButton>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
