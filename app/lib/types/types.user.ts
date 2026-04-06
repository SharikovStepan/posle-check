import { FriendshipUiStatus } from "./types.friends";

export interface User {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  email: string;
  friendship_status: FriendshipUiStatus;
  friendship_id: string | null;
  marked?: boolean;
}

export interface dbUserRow {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  email: string;
  friendship_status: string;
  friendship_id: string | null;
}

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  email: string;
//   providerId: string;
}
