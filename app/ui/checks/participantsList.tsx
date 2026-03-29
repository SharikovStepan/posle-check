import { CreateCheckParticipantsCardsType } from "@/app/lib/types/types.checks";
import ParticipantCardAdd from "./participantCardAdd";
import ParticipantCardAmount from "./participantCardAmount";
import { useParticipantsContext } from "./participantsProvider";
import { PROFILE_UUID } from "@/app/lib/placeholders-data";

export default function ParticipantsList() {
  const participantsContext = useParticipantsContext();

  const filtered = participantsContext.state.participanstList.filter((member) => member.participating && member.id != PROFILE_UUID);
  return (
    <>
      {filtered.map((member) => {
        return <ParticipantCardAmount key={`${member.id}-choose`} participantData={member} />;
      })}
    </>
  );
}
