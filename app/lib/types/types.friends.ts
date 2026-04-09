import { FriendsListTabs, SortBy, SortOrder } from "./types.filters";
import { User } from "./types.user";

export type FriendshipUiStatus = "friendly" | "pending" | "awaiting_confirm" | "none" | "declined" | "youDecline";

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
}

export interface GetFriendsOptions {
  currentUserId: string;
  filter?: FriendsListTabs;

  search?: string;

  sortBy?: SortBy;
  order?: SortOrder;

  limit?: number;
  currentPage?: number;
}

export interface FriendsListResult {
  users: User[];
  total: number; // всего друзей/заявок
  totalPages: number; // всего страниц
  page: number; // текущая страница (offset / limit + 1)
}
