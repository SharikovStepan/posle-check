import { ParticipantsActions } from "@/app/lib/types/types.checks";
import { ParticipantState } from "./participantsProvider";

export const participantsReducer = (state: ParticipantState, action: ParticipantsActions): ParticipantState => {
  switch (action.type) {
    case "ADD_TO_PARTICIPANTS":
      return {
        lastDispatch: { type: "ADD_TO_PARTICIPANTS", id: action.payload.id },
        participanstList: state.participanstList.map((member) => {
          if (member.id == action.payload.id) {
            return { ...member, amount: 0, participating: true };
          } else {
            return { ...member, amount: 0 };
          }
        }),
        creator: action.payload.id == state.creator.id ? { ...state.creator, participating: true, amount: 0 } : { ...state.creator, amount: 0 },
        total: state.total,
        tips: state.tips,
      };

    case "DELETE_FROM_PARTICIPANTS":
      return {
        lastDispatch: { type: "DELETE_FROM_PARTICIPANTS", id: action.payload.id },
        participanstList: state.participanstList.map((member) => {
          if (member.id == action.payload.id) {
            return { ...member, amount: 0, participating: false };
          } else {
            return { ...member, amount: 0 };
          }
        }),
        creator: action.payload.id == state.creator.id ? { ...state.creator, participating: false, amount: 0 } : { ...state.creator, amount: 0 },
        total: state.total,
        tips: state.tips,
      };
    case "SET_AMOUNT":
      return {
        lastDispatch: { type: "SET_AMOUNT", id: action.payload.id, amount: action.payload.amount },
        participanstList: state.participanstList.map((member) => {
          if (member.id == action.payload.id) {
            return { ...member, amount: parseFloat(action.payload.amount.toFixed(1)) };
          } else {
            return member;
          }
        }),
        creator: state.creator,
        total: state.total,
        tips: state.tips,
      };
    case "SET_AMOUNT_CREATOR":
      return {
        lastDispatch: { type: "SET_AMOUNT_CREATOR", amount: action.payload.amount },
        participanstList: [...state.participanstList],
        creator: { ...state.creator, amount: parseFloat(action.payload.amount.toFixed(1)) },
        total: state.total,
        tips: state.tips,
      };
    case "CLEAR_AMOUNT":
      return {
        lastDispatch: { type: "CLEAR_AMOUNT", id: action.payload.id },
        participanstList: state.participanstList.map((member) => {
          if (member.id == action.payload.id) {
            return { ...member, amount: 0 };
          } else {
            return member;
          }
        }),
        creator: action.payload.id == state.creator.id ? { ...state.creator, amount: 0 } : { ...state.creator },
        total: state.total,
        tips: state.tips,
      };
    case "SHARE_AMOUNT":
      return {
        lastDispatch: { type: "SHARE_AMOUNT" },
        participanstList: state.participanstList.map((member) => {
          return { ...member, amount: parseFloat(action.payload.amount.toFixed(1)) };
        }),
        creator: state.creator,
        total: state.total,
        tips: state.tips,
      };

    case "CANCEL_SHARE":
      return {
        lastDispatch: { type: "CANCEL_SHARE" },
        participanstList: state.participanstList.map((member) => {
          return { ...member, amount: 0 };
        }),
        creator: state.creator,
        total: state.total,
        tips: state.tips,
      };

    case "ADD_ALL":
      return {
        lastDispatch: { type: "ADD_ALL" },
        participanstList: state.participanstList.map((member) => {
          return { ...member, participating: true };
        }),
        creator: { ...state.creator, participating: true },
        total: state.total,
        tips: state.tips,
      };
    case "DELETE_ALL":
      return {
        lastDispatch: { type: "DELETE_ALL" },
        participanstList: state.participanstList.map((member) => {
          return { ...member, participating: false };
        }),
        creator: { ...state.creator, participating: false },
        total: state.total,
        tips: state.tips,
      };
    case "SET_TOTAL":
      return {
        lastDispatch: { type: "SET_TOTAL" },
        participanstList: state.participanstList,
        creator: state.creator,
        total: action.payload.amount,
        tips: state.tips,
      };
    case "SET_TIPS":
      return {
        lastDispatch: { type: "SET_TOTAL" },
        participanstList: state.participanstList,
        creator: state.creator,
        total: state.total,
        tips: action.payload.amount,
      };
    default:
      return state;
  }
};
