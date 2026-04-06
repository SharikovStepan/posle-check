import { getGroupsList } from "@/app/lib/data/data.groups";
import { GetGroupsOptions, GroupListResult } from "@/app/lib/types/types.groups";
import GroupCard from "./groupCard";

export default async function GroupsList({ options }: { options: GetGroupsOptions }) {
  const groupsData: GroupListResult = await getGroupsList(options);

  return (
    <>
      {groupsData.groups.length != 0 ? (
        <div className="w-full flex flex-col gap-3">
          {groupsData.groups.map((group) => {
            return <GroupCard key={group.id} groupData={group} />;
          })}
        </div>
      ) : (
        <div>
          <p>У вас нет групп</p>
          <p></p>
        </div>
      )}
    </>
  );
}
