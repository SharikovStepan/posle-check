import { CreateCheckParticipantsCardsType, ParticipantsActions } from "@/app/lib/types/types.checks";
import { ParticipantState } from "./participantsProvider";

export const participantsReducer = (state: ParticipantState, action: ParticipantsActions): ParticipantState => {
  switch (action.type) {
    case "ADD_TO_PARTICIPANTS":
      return {
        lastDispatch: "ADD_TO_PARTICIPANTS",
        participanstList: state.participanstList.map((member) => {
          if (member.id == action.payload.id) {
            return { ...member, participating: true };
          } else {
            return member;
          }
        }),
      };

    case "DELETE_FROM_PARTICIPANTS":
      return {
        lastDispatch: "DELETE_FROM_PARTICIPANTS",
        participanstList: state.participanstList.map((member) => {
          if (member.id == action.payload.id) {
            return { ...member, participating: false };
          } else {
            return member;
          }
        }),
      };
    case "SET_AMOUNT":
      return {
        lastDispatch: "SET_AMOUNT",
        participanstList: state.participanstList.map((member) => {
          if (member.id == action.payload.id) {
            return { ...member, amount: action.payload.amount };
          } else {
            return member;
          }
        }),
      };
    case "CLEAR_AMOUNT":
      return {
        lastDispatch: "CLEAR_AMOUNT",
        participanstList: state.participanstList.map((member) => {
          if (member.id == action.payload.id) {
            return { ...member, amount: null };
          } else {
            return member;
          }
        }),
      };
    case "SHARE_AMOUNT":
      return {
        lastDispatch: "SHARE_AMOUNT",
        participanstList: state.participanstList.map((member) => {
          return { ...member, amount: action.payload.amount };
        }),
      };
		case "CANCEL_SHARE":
			return {
			  lastDispatch: "CANCEL_SHARE",
			  participanstList: state.participanstList.map((member) => {
				 return { ...member, amount: null };
			  }),
			};

    case "ADD_ALL":
      return {
        lastDispatch: "ADD_ALL",
        participanstList: state.participanstList.map((member) => {
          return { ...member, participating: true };
        }),
      };
    case "DELETE_ALL":
      return {
        lastDispatch: "DELETE_ALL",
        participanstList: state.participanstList.map((member) => {
          return { ...member, participating: false };
        }),
      };
    default:
      return state;
  }
};
