import { CreateCheckParticipantsCardsType } from "@/app/lib/types/types.checks";
import ParticipantCardAdd from "./participantCardAdd";
import { useParticipantsContext } from "./participantsProvider";

export default function MembersList({ searchQuery }: { searchQuery: string }) {
  const participantsContext = useParticipantsContext();

  const searchFiltered = participantsContext.state.participanstList.filter((member) => {
    const fullNameTrimed = member.full_name?.toLowerCase().trim();
    const usernameTrimed = member.username.toLowerCase().trim();
    const searchTrimed = searchQuery.toLowerCase().trim();

    if (fullNameTrimed?.includes(searchTrimed) || usernameTrimed.includes(searchTrimed)) {
      return true;
    }
  });

  return (
    <>
      {searchFiltered.map((member) => {
        return <ParticipantCardAdd key={`${member.id}-choose`} participantData={member} />;
      })}
    </>
  );
}
