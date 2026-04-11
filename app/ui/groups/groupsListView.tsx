import { GroupListResult } from "@/app/lib/types/types.groups";
import GroupCard from "./groupCard";
import InviteGroupCard from "./inviteGroupCard";

export function GroupsListView({ groupsData, currentUserId }:{ groupsData:GroupListResult; currentUserId:string; }) {

  const membered = groupsData.groups.filter((g) => g.current_user_status === "accepted");

  const requests = groupsData.groups.filter((g) => g.current_user_status === "pending");

  return (
    <div className="w-full flex flex-col gap-3">
      {requests.map((group) => (
        <InviteGroupCard key={group.id} currentUserId={currentUserId} groupData={group} />
      ))}

      {membered.map((group) => (
        <GroupCard key={group.id} groupData={group} />
      ))}

      {requests.length === 0 && membered.length === 0 && <p className="w-full text-center">У вас нет групп</p>}
    </div>
  );
}
