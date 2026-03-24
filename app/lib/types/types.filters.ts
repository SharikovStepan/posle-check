export type FilterButton<T extends string> = { filterType: T; text: string; icon: string };

export type FriendsListType = "friends" | "outgoing" | "incoming";
export type FriendsFilter = FriendsListType | "search";

export type SortBy = "date" | "name";
export type SortOrder = "asc" | "desc";
