import { User } from "@/app/lib/types/types.user";
import EditMemberCard from "./editMemberCard";

export default function AddedMembersList({ usersData }: { usersData: User[] }) {
  return (
    <>
      <div className="flex flex-col gap-3 w-full min-h-150 lg:h-full relative">
        <span className="absolute top-0 -left-6 block w-0.5 h-full bg-surface "></span>
        <h3 className="text-lg hidden lg:block lg:mb-2 text-start">Добавленные друзья</h3>

        {usersData.length > 0
          ? usersData.map((user) => {
              return <EditMemberCard choosedList={true} key={user.id} userData={user} />;
            })
          : ""}
      </div>
    </>
  );
}
