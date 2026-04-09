export type TabButtons<T extends string> = { tabType: T; text: string; icon?: string };

export type FriendsListTabs = "friends" | "outgoing" | "incoming";

// export type FriendsFilter = FriendsListType | "search";

export type SortBy = "date" | "name";
export type SortOrder = "asc" | "desc";

export type GroupListTabs = "all" | "created_by_me" | "created_by_others";
