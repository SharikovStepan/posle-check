import { CreateCheckParticipantsCardsType, ParticipantsActions } from "@/app/lib/types/types.checks";
import { ParticipantState } from "./participantsProvider";
import { PROFILE_UUID } from "@/app/lib/placeholders-data";

export const participantsReducer = (state: ParticipantState, action: ParticipantsActions): ParticipantState => {
  switch (action.type) {
    case "ADD_TO_PARTICIPANTS":
      return {
        lastDispatch: "ADD_TO_PARTICIPANTS",
        participanstList: state.participanstList.map((member) => {
          if (member.id == action.payload.id) {
            return { ...member, amount: 0, participating: true };
          } else {
            return { ...member, amount: 0 };
          }
        }),
        creator: action.payload.id == state.creator.id ? { ...state.creator, participating: true, amount: 0 } : { ...state.creator, amount: 0 },
        total: state.total,
      };

    case "DELETE_FROM_PARTICIPANTS":
      return {
        lastDispatch: "DELETE_FROM_PARTICIPANTS",
        participanstList: state.participanstList.map((member) => {
          if (member.id == action.payload.id) {
            return { ...member, amount: 0, participating: false };
          } else {
            return { ...member, amount: 0 };
          }
        }),
        creator: action.payload.id == state.creator.id ? { ...state.creator, participating: false, amount: 0 } : { ...state.creator, amount: 0 },
        total: state.total,
      };
    case "SET_AMOUNT":
      return {
        lastDispatch: "SET_AMOUNT",
        participanstList: state.participanstList.map((member) => {
          if (member.id == action.payload.id) {
            return { ...member, amount: parseFloat(action.payload.amount.toFixed(1)) };
          } else {
            return member;
          }
        }),
        creator: action.payload.id == state.creator.id ? { ...state.creator, amount: parseFloat(action.payload.amount.toFixed(1)) } : { ...state.creator },
        total: state.total,
      };
    case "SET_AMOUNT_CREATOR":
      return {
        lastDispatch: "SET_AMOUNT_CREATOR",
        participanstList: [...state.participanstList],
        creator: { ...state.creator, amount: parseFloat(action.payload.amount.toFixed(1)) },
        total: state.total,
      };
    case "CLEAR_AMOUNT":
      return {
        lastDispatch: "CLEAR_AMOUNT",
        participanstList: state.participanstList.map((member) => {
          if (member.id == action.payload.id) {
            return { ...member, amount: 0 };
          } else {
            return member;
          }
        }),
        creator: action.payload.id == state.creator.id ? { ...state.creator, amount: 0 } : { ...state.creator },
        total: state.total,
      };
    case "SHARE_AMOUNT":
      return {
        lastDispatch: "SHARE_AMOUNT",
        participanstList: state.participanstList.map((member) => {
          return { ...member, amount: parseFloat(action.payload.amount.toFixed(1)) };
        }),
        creator: { ...state.creator, amount: state.creator.participating ? parseFloat(action.payload.amount.toFixed(1)) : 0 },
        total: state.total,
      };
    case "SHARE_AMOUNT_NOT_CREATOR":
      return {
        lastDispatch: "SHARE_AMOUNT_NOT_CREATOR",
        participanstList: state.participanstList.map((member) => {
          if (member.id == PROFILE_UUID) {
            return member;
          } else {
            return { ...member, amount: parseFloat(action.payload.amount.toFixed(1)) };
          }
        }),
        creator: { ...state.creator },
        total: state.total,
      };

    case "CANCEL_SHARE":
      return {
        lastDispatch: "CANCEL_SHARE",
        participanstList: state.participanstList.map((member) => {
          return { ...member, amount: 0 };
        }),
        creator: { ...state.creator, amount: 0 },
        total: state.total,
      };

    case "ADD_ALL":
      return {
        lastDispatch: "ADD_ALL",
        participanstList: state.participanstList.map((member) => {
          return { ...member, participating: true };
        }),
        creator: { ...state.creator, participating: true },
        total: state.total,
      };
    case "DELETE_ALL":
      return {
        lastDispatch: "DELETE_ALL",
        participanstList: state.participanstList.map((member) => {
          return { ...member, participating: false };
        }),
        creator: { ...state.creator, participating: false },
        total: state.total,
      };
    case "SET_TOTAL":
      return {
        lastDispatch: "SET_TOTAL",
        participanstList: state.participanstList,
        creator: state.creator,
        total: action.payload.amount,
      };
    default:
      return state;
  }
};
