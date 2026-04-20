import { CreateCheckParticipantsCardsType } from "@/app/lib/types/types.checks";

export const isAllAdded = (members: CreateCheckParticipantsCardsType[]): boolean => {
  return members.every((member) => member.amount != 0);
};

export const isEqualParticipantsAmounts = (members: CreateCheckParticipantsCardsType[], creator: CreateCheckParticipantsCardsType): boolean => {
  const participatedMembers = members.filter((member) => member.participating);

  const withCreator = creator.participating ? [...participatedMembers, creator] : [...participatedMembers];
  return withCreator.every((member) => member.amount == participatedMembers[0].amount && member.amount >= 1);
};

export const calculateTips = (tipsAmount: number, members: { id: string; amount: number }[], creator: { id: string; participating: boolean; amount: number }): number => {
  const memberTips = tipsAmount > 0 ? tipsAmount / (members.length + (creator.participating ? 1 : 0)) : 0;

  return parseFloat(memberTips.toFixed(1));
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

export const maxPossibeAmountValue = (totalAmount: number, members: CreateCheckParticipantsCardsType[], creator?: CreateCheckParticipantsCardsType, targetId?: string) => {
  const participatingMembers = members.filter((members) => members.id != targetId && !members.isCreator);
  const participnatsWithAmounts = participatingMembers.filter((participant) => participant.amount >= 1);
  const creatorValue = creator?.participating ? creator.amount : 0;

  if (isAllParticipantsCustomAmounts(members)) {
    return totalAmount - (creatorValue + sumParticipantsAmount(participatingMembers));
  } else {
    return totalAmount - (creatorValue + sumParticipantsAmount(participatingMembers)) - participatingMembers.length + participnatsWithAmounts.length;
  }
};

export const isEmptyParticipantsAmounts = (members: CreateCheckParticipantsCardsType[]): number => {
  const memebersWithOpenAmounts = members.filter((member) => member.participating && member.amount > 0 && member.amount < 1);
  return memebersWithOpenAmounts.length;
};

export const isNotCustomParticipantsAmounts = (members: CreateCheckParticipantsCardsType[]): number => {
  const memebersWithNoAmounts = members.filter((member) => member.participating && member.amount >= 0 && member.amount < 1);
  return memebersWithNoAmounts.length;
};
