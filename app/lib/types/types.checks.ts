import { GroupMemberCardQuery } from "./types.groups";

export type CheckByUserCardType = {
  id: string;
  title: string;
  created_at: Date;
  icon_url: string | null;
  creator_participating: boolean;
  is_pending_payments: boolean;

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

  payment_status: "confirmed" | "pending" | "declined" | "unpaid";
  payment_amount: number | null;

  share_amount: number | null;
  tips_amount: number | null;
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
  | { type: "CANCEL_SHARE" }
  | { type: "ADD_ALL" }
  | { type: "DELETE_ALL" }
  | { type: "SET_TOTAL"; payload: { amount: number } }
  | { type: "SET_TIPS"; payload: { amount: number } };

export type ParticipantsActionsTypes =
  | "ADD_TO_PARTICIPANTS"
  | "DELETE_FROM_PARTICIPANTS"
  | "SET_AMOUNT"
  | "SET_AMOUNT_CREATOR"
  | "CLEAR_AMOUNT"
  | "SHARE_AMOUNT"
  | "CANCEL_SHARE"
  | "ADD_ALL"
  | "DELETE_ALL"
  | "SET_TOTAL"
  | "SET_TIPS";

export type LastDispatchInfo = {
  type: ParticipantsActionsTypes;
  id?: string;
  amount?: number;
};

export type CreateCheckActionData = {
  title: string;
  description: string | null;
  totalAmount: number;
  tipsForParticipant: number;
  creator: { id: string; participating: boolean; amount: number };
  participants: { id: string; amount: number }[];
};

export type ParticipantPayment = {
  id: string;
  amount: number;
  status: "pending" | "confirmed" | "declined";
};

export type CheckDetailsParticipant = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;

  share_amount: number | null;
  tips_amount: number | null;
  payments: ParticipantPayment[];
};

export type CheckDetailsByUserType = {
  id: string;
  title: string;
  icon_url: string | null;
  photo_url: string | null;
  description: string | null;
  total_amount: number;
  paid_amount: number;
  created_at: string;
  paid_count: number;

  creator: { id: string; full_name: string; username: string; avatar_url: string; participating: boolean; amount: number };
  participants: CheckDetailsParticipant[];
};

export type SendPaymentType = {
  success?: boolean;
  error?: {
    payment_amount?: string;
  };
};

export type ConfirmPaymentType = {
  success?: boolean;
  error?: {
    payment_amount?: string;
  };
};
