import { CreateCheckParticipantsCardsType } from "@/app/lib/types/types.checks";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { useParticipantsContext } from "./participantsProvider";

export default function ParticipantCardAdd({ participantData }: { participantData: CreateCheckParticipantsCardsType }) {
  const ParticipantsContext = useParticipantsContext();

  return (
    <div
      onClick={() => {
        if (participantData.participating) {
          ParticipantsContext.dispatch({ type: "DELETE_FROM_PARTICIPANTS", payload: { id: participantData.id } });
        } else {
          ParticipantsContext.dispatch({ type: "ADD_TO_PARTICIPANTS", payload: { id: participantData.id } });
        }
      }}
      className={`${
        !participantData.participating ? "hover:border-accent-light/10 hover:bg-surface-hover" : "border-border-focus hover:border-border-focus/50 bg-accent-light/7! hover:bg-accent-hover/13!"
      } cursor-pointer relative p-2 rounded-2xl bg-surface h-20 flex gap-3 justify-between items-center transition-all duration-200 border border-border shadow-md`}>
      <div className="h-full flex flex-col justify-between">
        <div className={` h-full flex items-center gap-3`}>
          <div className={`h-12 w-12 rounded-full overflow-hidden`}>
            {participantData.avatar_url ? (
              <img src={participantData.avatar_url} alt="group icon" className="w-full h-full object-cover" />
            ) : (
              <UserCircleIcon className={`h-full w-full text-accent/80 overflow-hidden`} />
            )}
          </div>

          <p className="text-text-primary text-lg grow">{participantData.full_name || participantData.username}</p>
        </div>
      </div>
    </div>
  );
}
