import { CreateCheckParticipantsCardsType } from "@/app/lib/types/types.checks";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export default function ConfirmCreate({
  totalAmount,
  tittle,
  creator,
  members,
}: {
  totalAmount: number;
  tittle: string;
  creator: CreateCheckParticipantsCardsType;
  members: CreateCheckParticipantsCardsType[];
}) {
  return (
    <>
      <div className="flex flex-col gap-2 border rounded-lg p-4 bg-bg-secondary">
        <div className="title border">
          <p>Название: </p>
          <h4>{tittle}</h4>
        </div>
        <div className="amount border">
          <p>Сумма: </p>
          <p>{totalAmount}</p>
        </div>
        <div className="creator border">
          <p>Моя часть: </p>
          <p>{creator.participating ? creator.amount : "Не участвую"}</p>
        </div>

        <div className="amount border">
          {members.map((member) => {
            if (member.participating) {
              return (
                <div className=" flex justify-between">
                  <div className={`h-full flex items-center gap-3`}>
                    {member.avatar_url ? (
                      <div className={`h-12 rounded-full overflow-hidden`}>
                        <img src={member.avatar_url} alt="group icon" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <UserCircleIcon className={`h-12 w-full text-accent/80 overflow-hidden`} />
                    )}
                  </div>

                  <p>{member.full_name || member.username}</p>

                  <p>{member.amount}</p>
                </div>
              );
            }
          })}
        </div>
      </div>
    </>
  );
}
