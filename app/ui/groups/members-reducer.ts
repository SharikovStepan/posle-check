import { MembersActions, MembersArray } from "@/app/lib/types/types.groups";

export const membersInitialState: MembersArray = [];

export const membersReducer = (state: MembersArray, action: MembersActions): MembersArray => {
  switch (action.type) {
    case "ADD_MEMBER":
      if (!state.find((stateUser) => stateUser.id == action.payload.id)) {
        return [...state, action.payload];
      } else {
        return state;
      }

    case "DELETE_MEMBER":
      return state.filter((stateUser) => stateUser.id !== action.payload.id);
    default:
      return state;
  }
};
