import { GroupMemberCard } from "@/app/lib/types/types.groups";
import { UserCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ActionInviteButton from "./actionInviteButton";

export default function GroupdMember({ memberData, groupId, currentUserId }: { currentUserId: string; groupId: string; memberData: GroupMemberCard }) {
  const status = memberData.status == "pending" ? "Ожидается подтверждение" : memberData.status == "declined" ? "Отклонил приглашение" : memberData.role == "admin" ? "Админ" : "Участник";
  return (
    <>
      <div className={`relative px-4 py-1 rounded-2xl bg-surface transition-all duration-200 border border-border shadow-md`}>
        <div className="h-full grid grid-cols-[50px_1fr_1fr] grid-rows-[1fr_16px] w-full justify-items-center items-center">
          <div className="col-[1/2] row-[1/2]">
            {memberData.avatar_url ? (
              <div className={`h-12 rounded-full overflow-hidden`}>
                <img src={memberData.avatar_url} alt="group icon" className="w-full h-full object-cover" />
              </div>
            ) : (
              <UserCircleIcon className={`h-12 w-full text-accent/80 overflow-hidden`} />
            )}
          </div>

          <div className="flex flex-col justify-between justify-self-start ml-2 items-start col-[2/3] row-[1/2]">
            <p className="text-text-primary text-xl">{memberData.full_name || memberData.username}</p>
          </div>
          <div className="col-[1/3] row-[2/3] justify-self-start">
            <p className={`${memberData.status == "pending" ? "text-warning/70" : memberData.status == "declined" ? "text-error/80" : "text-text-tertiary/80"} text-xs`}>{status}</p>
          </div>

          <div className="text-sm justify-self-end col-[3/4] row-[1/3]">
            {/* {memberData.unpaid_checks_count > 0 ? (
              <div className="flex justify-center items-center gap-2 text-warning">
                <p>Неоплаченных чеков:</p>
                <p>{memberData.unpaid_checks_count}</p>
              </div>
            ) : (
              <p className="text-success">Все чеки оплачены</p>
            )} */}

            {memberData.status == "declined" && currentUserId == memberData.invited_by ? (
              <div className="flex flex-col justify-between items-end gap-2 text-text-tertiary h-full">
                <ActionInviteButton action="delete" groupId={groupId} memberId={memberData.id} className="cursor-pointer px-3 py-0.5 bg-error text-text-inverted rounded-md text-sm min-w-20 ">
                  Удалить
                </ActionInviteButton>

                <ActionInviteButton action="resend" groupId={groupId} memberId={memberData.id} className="cursor-pointer px-0.5! py-0.5 bg-accent text-text-inverted rounded-md text-sm min-w-30 ">
                  Повторить запрос
                </ActionInviteButton>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
}
