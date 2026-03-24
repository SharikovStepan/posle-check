"use server";

import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { getFriendshipByUsers } from "../data/data.friendship";
import { Friendship } from "../types/types.friends";

export type FriendshipState = {
  id?: string;
  status?: string;
};

export type RequestFriendActions = "accept" | "decline" | "send" | "cancel";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function sendFriendRequestByUsers(prevState: FriendshipState, formData: FormData): Promise<FriendshipState> {
  const currentUserId = formData.get("currentUserId") as string;
  const targetUserId = formData.get("targetUserId") as string;
  const currentPath = formData.get("currentPath") as string;
  const searchParams = formData.get("searchParams") as string;

  try {
    // Проверяем, есть ли уже существующая запись
    const existingFriendship = await getFriendshipByUsers(currentUserId, targetUserId);

    if (existingFriendship) {
      // Если запись существует, обновляем статус на pending
      const [updated] = await sql<Friendship[]>`
			 UPDATE friendships
			 SET 
				status = 'pending',
				updated_at = NOW()
			 WHERE id = ${existingFriendship.id}
			 RETURNING *
		  `;

      revalidateRerender(currentPath, searchParams);

      return { id: updated.id, status: updated.status };
    } else {
      // Если записи нет, создаём новую
      const [newFriendship] = await sql<Friendship[]>`
			 INSERT INTO friendships (user_id, friend_id, status)
			 VALUES (${currentUserId}, ${targetUserId}, 'pending')
			 RETURNING *
		  `;

      revalidateRerender(currentPath, searchParams);

      return { id: newFriendship.id, status: newFriendship.status };
    }
  } catch (error) {
    console.error("Ошибка при отправке запроса в друзья:", error);
    return { status: "error" };
    throw new Error("Не удалось отправить запрос в друзья");
  }
}

function revalidateRerender(path: string, search: string): void {
  if (path) {
    const fullPath = search ? `${path}?${search}` : path;
    revalidatePath(fullPath);
  }
}

export async function requestFriendAction(actionType: RequestFriendActions, prevState: FriendshipState, formData: FormData): Promise<FriendshipState> {
  const currentUserId = formData.get("currentUserId") as string;
  const friendshipId = formData.get("friendshipId") as string;
  const currentPath = formData.get("currentPath") as string;
  const searchParams = formData.get("searchParams") as string;

  let id = "";
  let status = "";

  try {
    if (actionType === "accept" || actionType === "decline") {
      const newStatus = actionType === "accept" ? "accepted" : "declined";
      const [friendship] = await sql<Friendship[]>`
		UPDATE friendships
		SET 
		  status = ${newStatus},
		  updated_at = NOW()
		WHERE id = ${friendshipId}
		  AND friend_id = ${currentUserId}
		RETURNING *
	 `;

      if (!friendship) {
        throw new Error("Запрос на дружбу не найден или не может быть принят");
      }

      id = friendship.id;
      status = friendship.status;
    } else if (actionType === "send") {
      const [friendship] = await sql<Friendship[]>`
		UPDATE friendships
		SET 
		  status = 'pending',
		  updated_at = NOW()
		WHERE id = ${friendshipId}
		  AND user_id = ${currentUserId}
		RETURNING *
	 `;

      if (!friendship) {
        throw new Error("Запрос на дружбу не найден или не может быть принят");
      }
      id = friendship.id;
      status = friendship.status;
    } else if (actionType === "cancel") {
      const result = await sql`
		  DELETE FROM friendships
		  WHERE id = ${friendshipId}
			 AND (
			 user_id = ${currentUserId}
			 OR friend_id = ${currentUserId}
	       )
		  RETURNING id
		`;
      status = "deleted";
    }

    revalidateRerender(currentPath, searchParams);

    return { id, status };
  } catch (error) {
    console.error("Ошибка при принятии запроса:", error);
    return { status: "error" };
    throw new Error("Не удалось принять запрос в друзья");
  }
}
