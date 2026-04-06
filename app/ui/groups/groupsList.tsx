import { getGroupsList } from "@/app/lib/data/data.groups";
import { GetGroupsOptions, GroupListResult } from "@/app/lib/types/types.groups";
import GroupCard from "./groupCard";
import InviteGroupCard from "./inviteGroupCard";

export default async function GroupsList({ currentUserId, options }: { currentUserId: string; options: GetGroupsOptions }) {
  const groupsData: GroupListResult = await getGroupsList(options);

  const membered = groupsData.groups.filter((g) => g.current_user_status == "accepted");
  const requests = groupsData.groups.filter((g) => g.current_user_status == "pending");

  return (
    <>
      <div className="w-full flex flex-col gap-3">
        {requests.length != 0 &&
          requests.map((group) => {
            return <InviteGroupCard key={group.id} currentUserId={currentUserId} groupData={group} />;
          })}

        {membered.length != 0 &&
          membered.map((group) => {
            return <GroupCard key={group.id} groupData={group} />;
          })}

        {requests.length == 0 && membered.length == 0 && <p className="w-full text-center">У вас нет групп</p>}
      </div>
    </>
  );
}
