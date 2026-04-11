import ParticipantCardAmount from "./participantCardAmount";
import { useParticipantsContext } from "./participantsProvider";

export default function ParticipantsList() {
  const participantsContext = useParticipantsContext();

  const filtered = participantsContext.state.participanstList.filter((member) => member.participating);
  return (
    <>
      {filtered.map((member) => {
        return <ParticipantCardAmount key={`${member.id}-choose`} participantData={member} />;
      })}
    </>
  );
}
