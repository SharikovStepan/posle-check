import { User } from "./types.user";

export type MembersArray = User[];

export type MembersActions = { type: "ADD_MEMBER"; payload: User } | { type: "DELETE_MEMBER"; payload: User };
