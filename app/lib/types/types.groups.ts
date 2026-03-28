import { GroupListType } from "./types.filters";
import { User } from "./types.user";

export type Group = {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  members_count: number;
  checks_count: number;

  avatars: (string | null)[];
};

export interface GroupListResult {
  groups: Group[];
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
