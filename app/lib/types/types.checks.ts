import { GroupMemberCardQuery } from "./types.groups";

export type CheckByUserCardType = {
  id: string;
  title: string;
  created_at: Date;
  icon_url: string | null;

  total_amount: string;
  paid_amount: string;

  participants_count: number;
  paid_participants_count: number;
};

export type CheckToUserCardType = {
  id: string;
  title: string;
  icon_url: string | null;
  created_at: Date;

  participated: boolean;
  is_paid: boolean;

  share_amount: string | null;
};

export type CreateCheckPageTabs = "members" | "amounts";

// export type CreateCheckMembersCardsType = GroupMemberCardQuery & { participating?: true };

export type CreateCheckParticipantsCardsType = GroupMemberCardQuery & { participating: boolean; amount: number; isCreator: boolean };

export type ParticipantsActions =
  | { type: "ADD_TO_PARTICIPANTS"; payload: { id: string } }
  | { type: "DELETE_FROM_PARTICIPANTS"; payload: { id: string } }
  | { type: "SET_AMOUNT"; payload: { id: string; amount: number } }
  | { type: "SET_AMOUNT_CREATOR"; payload: { amount: number } }
  | { type: "CLEAR_AMOUNT"; payload: { id: string } }
  | { type: "SHARE_AMOUNT"; payload: { amount: number } }
  | { type: "SHARE_AMOUNT_NOT_CREATOR"; payload: { amount: number } }
  | { type: "CANCEL_SHARE" }
  | { type: "ADD_ALL" }
  | { type: "DELETE_ALL" }
  | { type: "SET_TOTAL"; payload: { amount: number } };

export type ParticipantsActionsTypes =
  | "ADD_TO_PARTICIPANTS"
  | "DELETE_FROM_PARTICIPANTS"
  | "SET_AMOUNT"
  | "SET_AMOUNT_CREATOR"
  | "CLEAR_AMOUNT"
  | "SHARE_AMOUNT"
  | "SHARE_AMOUNT_NOT_CREATOR"
  | "CANCEL_SHARE"
  | "ADD_ALL"
  | "DELETE_ALL"
  | "SET_TOTAL";

export type LastDispatchInfo = {
  type: ParticipantsActionsTypes;
  id?: string;
  amount?: number;
};
