import postgres from "postgres";
import { dbUserRow, User } from "../types/types.user";
import { Friendship, FriendshipUiStatus, FriendsListResult, GetFriendsOptions } from "../types/types.friends";
import { FriendsListTabs } from "../types/types.filters";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function searchUserByEmail(currentUserId: string, searchEmail: string): Promise<User | null> {
  try {
    // Ищем пользователя по email
    const decodedEmail = decodeURIComponent(searchEmail);

    const [user] = await sql`
		 SELECT 
			id,
			username,
			full_name,
			avatar_url,
			email
		 FROM profiles
		 WHERE LOWER(email) = ${decodedEmail.toLowerCase().trim()}
	  `;

    if (!user) {
      return null;
    }

    // Если ищем самого себя, статус дружбы не нужен
    if (user.id === currentUserId) {
      return {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        email: user.email,
        friendship_status: "none",
        friendship_id: null,
      };
    }

    // Проверяем статус дружбы
    const friendShipData = await getFriendshipData(currentUserId, user.id);

    return {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      email: user.email,
      friendship_status: friendShipData.status,
      friendship_id: friendShipData.id,
    };
  } catch (error) {
    console.error("Ошибка при поиске пользователя:", error);
    throw new Error("Не удалось выполнить поиск пользователя");
  }
}

async function getFriendshipData(currentUserId: string, targetUserId: string): Promise<{ status: FriendshipUiStatus; id: string | null }> {
  const friendship = await getFriendshipByUsers(currentUserId, targetUserId);

  const friendShipUiStatus = getFriendshipUiStatusByFriendship(friendship, currentUserId);

  return { status: friendShipUiStatus, id: friendship?.id ?? null };
}

export async function getFriendshipByUsers(userId: string, targetUserId: string): Promise<Friendship | null> {
  try {
    const [friendship] = await sql<Friendship[]>`
		 SELECT 
			id,
			user_id,
			friend_id,
			status
		 FROM friendships
		 WHERE (user_id = ${userId} AND friend_id = ${targetUserId})
			 OR (user_id = ${targetUserId} AND friend_id = ${userId})
	  `;

    return friendship || null;
  } catch (error) {
    console.error("Ошибка при получении записи о дружбе:", error);
    throw new Error("Не удалось получить информацию о дружбе");
  }
}

function getFriendshipUiStatusByFriendship(friendship: Friendship | null, currentUserId: string): FriendshipUiStatus {
  let friendshipStatus: FriendshipUiStatus = "none";

  if (friendship) {
    if (friendship.status === "accepted") {
      friendshipStatus = "friendly";
    } else if (friendship.status === "pending") {
      // Определяем, кто отправил запрос
      if (friendship.user_id === currentUserId) {
        friendshipStatus = "awaiting_confirm"; // текущий пользователь отправил запрос, ждёт подтверждения
      } else {
        friendshipStatus = "pending"; // текущему пользователю пришёл запрос, нужно подтвердить
      }
    } else if (friendship.status === "declined") {
      if (friendship.user_id === currentUserId) {
        friendshipStatus = "declined"; // текущий пользователь отправил запрос, ждёт подтверждения
      } else {
        friendshipStatus = "youDecline"; // текущему пользователю пришёл запрос, нужно подтвердить
      }
    }
  }

  return friendshipStatus;
}

function getFriendshipUiStatusByQueryStatus(queryStatus: FriendsListTabs, userFriendshipStatus: string): FriendshipUiStatus {
  if (queryStatus == "friends") return "friendly";

  if (queryStatus == "outgoing") {
    if (userFriendshipStatus == "pending") return "awaiting_confirm";
    return "declined";
  }
  if (queryStatus == "incoming") {
    if (userFriendshipStatus == "pending") return "pending";
    return "youDecline";
  }
  return "none";
}

export async function getFriendsList(options: GetFriendsOptions): Promise<FriendsListResult> {
  const { currentUserId, filter = "friends", search, sortBy = "date", order = "asc", limit = 5, currentPage = 1 } = options;

  try {
    let joinCondition;
    let whereCondition;

    switch (filter) {
      case "friends":
        joinCondition = sql`
			  ON (
				 (f.user_id = ${currentUserId} AND p.id = f.friend_id)
				 OR
				 (f.friend_id = ${currentUserId} AND p.id = f.user_id)
			  )
			`;
        whereCondition = sql`
			  f.status = 'accepted'
			  AND (f.user_id = ${currentUserId} OR f.friend_id = ${currentUserId})
			`;
        break;

      case "outgoing":
        joinCondition = sql`ON p.id = f.friend_id`;
        whereCondition = sql`
			  f.user_id = ${currentUserId} 
			  AND f.status != 'accepted'
			`;
        break;

      case "incoming":
        joinCondition = sql`ON p.id = f.user_id`;
        whereCondition = sql`
			  f.friend_id = ${currentUserId} 
			  AND f.status != 'accepted'
			`;
        break;

      default:
        throw new Error("Invalid friends list type");
    }

    // Поиск
    const searchCondition = search
      ? sql`
			AND (
			  LOWER(p.username) LIKE ${"%" + search.toLowerCase() + "%"}
			  OR LOWER(p.full_name) LIKE ${"%" + search.toLowerCase() + "%"}
			  OR LOWER(p.email) LIKE ${"%" + search.toLowerCase() + "%"}
			)
		 `
      : sql``;

    // 1️⃣ Получаем общее количество
    const [{ count }] = await sql<{ count: number }[]>`
		 SELECT COUNT(*)::int as count
		 FROM friendships f
		 JOIN profiles p
		 ${joinCondition}
		 WHERE ${whereCondition}
		 ${searchCondition}
	  `;

    const offset = limit * (currentPage - 1);

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);
    const page = Math.floor(offset / limit) + 1;

    // Сортировка
    const sortColumn = sortBy === "name" ? sql`p.username` : sql`f.created_at`;
    const sortOrder = order === "asc" ? sql`ASC` : sql`DESC`;

    // 2️⃣ Получаем сами данные
    const users = await sql<User[]>`
		 SELECT
			p.id,
			p.username,
			p.full_name,
			p.avatar_url,
			p.email,
			f.id as friendship_id,
			f.status as friendship_status,
			f.created_at
		 FROM friendships f
		 JOIN profiles p
		 ${joinCondition}
		 WHERE ${whereCondition}
		 ${searchCondition}
		 ORDER BY ${sortColumn} ${sortOrder}
		 LIMIT ${limit}
		 OFFSET ${offset}
	  `;

    // 3️⃣ Мапим статус
    const mappedUsers: User[] = users.map((user) => ({
      ...user,
      friendship_status: getFriendshipUiStatusByQueryStatus(filter, user.friendship_status),
    }));

    return { users: mappedUsers, total, totalPages, page };
  } catch (error) {
    console.error("Ошибка при получении списка друзей:", error);
    throw new Error("Не удалось получить список друзей");
  }
}
