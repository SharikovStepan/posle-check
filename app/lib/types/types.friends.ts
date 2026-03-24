import { FriendsListType, SortBy, SortOrder } from "./types.filters";

export type FriendshipUiStatus = "friendly" | "pending" | "awaiting_confirm" | "none" | "declined" | "youDecline";

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
}

export interface GetFriendsOptions {
  currentUserId: string;
  filter: FriendsListType;

  search?: string;

  sortBy?: SortBy;
  order?: SortOrder;

  limit?: number;
  currentPage?: number;
}
