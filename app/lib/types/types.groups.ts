import { CheckByUserCardType, CheckToUserCardType } from "./types.checks";
import { GroupListType } from "./types.filters";
import { User } from "./types.user";

export type GroupCardType = {
  id: string;
  title: string;
  description: string | null;
  icon_url: string | null;
  created_by: GroupMemberCardQuery;
  current_user_role: "admin" | "member" | "pending";
  current_user_status: "pending" | "accepted" | "declined";
  created_at: string;
  updated_at: string;
  members_count: number;
  checks_count: number;
  avatars: (string | null)[];
};

export type GroupMemberCard = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  unpaid_checks_count: number;
  invited_by: string;
  role: "member" | "admin";
  status: "accepted" | "pending" | "declined";
};

export type GroupMemberCardQuery = Omit<GroupMemberCard, "unpaid_checks_count">;

export interface GroupListResult {
  groups: GroupCardType[];
  total: number; // всего друзей/заявок
  totalPages: number; // всего страниц
  page: number; // текущая страница (offset / limit + 1)
}

export type GetGroupsOptions = {
  currentUserId: string;
  filter?: GroupListType;
  search?: string;
  sortBy?: "date" | "name";
  order?: "asc" | "desc";
  limit?: number;
  currentPage?: number;
};

export type MembersArray = User[];

export type MembersActions = { type: "ADD_MEMBER"; payload: User } | { type: "DELETE_MEMBER"; payload: User };

export type Group = {
  id: string;
  title: string;
  description: string;
  icon_url: string | null;

  checks_count: number;
  members_count: number;

  checksByUser: CheckByUserCardType[];
  checksToUser: CheckToUserCardType[];
  members: GroupMemberCard[];
};

export type GroupQuery = Omit<Group, "checks" | "members">;

export type GroupPageTabs = "members" | "checksByUser" | "checksToUser";

export type CreateGroupPageTabs = "members" | "friends";
