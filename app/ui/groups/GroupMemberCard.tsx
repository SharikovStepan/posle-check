import { GroupMemberCard } from "@/app/lib/types/types.groups";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export default function GroupdMember({ memberData }: { memberData: GroupMemberCard }) {
  return (
    <>
      <div className={`relative px-4 py-2 rounded-2xl bg-surface h-20 flex gap-3 justify-between items-center transition-all duration-200 border border-border shadow-md`}>
        <div className="h-full flex justify-between items-center w-full">
          <div className={` h-full flex items-center gap-3`}>
            {memberData.avatar_url ? (
              <div className={`h-12 rounded-full overflow-hidden`}>
                <img src={memberData.avatar_url} alt="group icon" className="w-full h-full object-cover" />
              </div>
            ) : (
              <UserCircleIcon className={`h-12 w-full text-accent/80 overflow-hidden`} />
            )}
            <p className="text-text-primary text-lg">{memberData.full_name || memberData.username}</p>
          </div>

          <div className="text-sm">
            {memberData.unpaid_checks_count > 0 ? (
              <div className="flex justify-center items-center gap-2 text-warning">
                <p>Неоплаченных чеков:</p>
                <p>{memberData.unpaid_checks_count}</p>
              </div>
            ) : (
              <p className="text-success">Все чеки оплачены</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
