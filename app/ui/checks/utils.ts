import { CreateCheckParticipantsCardsType } from "@/app/lib/types/types.checks";

export const isAllAdded = (members: CreateCheckParticipantsCardsType[]): boolean => {
  return members.every((member) => member.amount != 0);
};

export const isEqualParticipantsAmounts = (members: CreateCheckParticipantsCardsType[]): boolean => {
  const participatedMembers = members.filter((member) => member.participating);

  return participatedMembers.every((member) => member.amount == participatedMembers[0].amount && member.amount != 0);
};

export const isAllParticipantsCustomAmounts = (members: CreateCheckParticipantsCardsType[]) => {
  const filtered = members.filter((member) => member.participating);

  return filtered.every((member) => member.amount > 0);
};

export const sumParticipantsAmount = (members: CreateCheckParticipantsCardsType[]) => {
  const membersShare = members.reduce((acc, member) => {
    const isParticipating = member.participating && !member.isCreator;
    if (isParticipating) {
      return acc + member.amount;
    } else {
      return acc;
    }
  }, 0);

  return membersShare;
};

export const maxPossibleCreatorValue = (totalAmount: number, members: CreateCheckParticipantsCardsType[]): number => {
  if (isAllParticipantsCustomAmounts(members)) {
    return totalAmount - sumParticipantsAmount(members);
  } else {
    return totalAmount - sumParticipantsAmount(members) - members.filter((member) => member.participating).length;
  }
};

export const maxPossibeParticipantValue = (totalAmount: number, members: CreateCheckParticipantsCardsType[], creator: CreateCheckParticipantsCardsType, targetId: string) => {
  const filtered = members.filter((members) => members.id != targetId || !members.isCreator);

  const creatorValue = creator.participating ? creator.amount : 0;

  if (isAllParticipantsCustomAmounts(members)) {
    return totalAmount - (creatorValue + sumParticipantsAmount(filtered)) - filtered.length;
  } else {
    return totalAmount - (creatorValue + sumParticipantsAmount(filtered));
  }
};
