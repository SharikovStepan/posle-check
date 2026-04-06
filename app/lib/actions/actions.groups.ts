"use server";

import { z } from "zod";
import postgres, { Sql } from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { auth } from "@/auth";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export type CreateGroupState = {
  success?: boolean;
  groupId?: string;
  errors?: {
    title?: string;
    members?: string;
    general?: string;
  };
};

export type AcceptGroupState = {
  success?: boolean;
};

const createGroupSchema = z.object({
  title: z.string().trim().min(1, "Название не может быть пустым"),
  description: z.string().optional(),
  members: z.array(z.string()).min(2, "Нужен хотя бы один участник помимо вас"),
  currentUserId: z.string(),
});

export async function createGroupAction(prevState: CreateGroupState, formData: FormData): Promise<CreateGroupState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title");
  const description = formData.get("description");
  const membersRaw = formData.get("members"); // JSON строка
  const currentUserId = session.user.id;

  let parsedMembers: string[] = [];

  // 👉 Парсим JSON отдельно (Zod тут не поможет напрямую)
  try {
    parsedMembers = JSON.parse(membersRaw as string);
  } catch {
    return {
      errors: {
        members: "Некорректный формат участников",
      },
    };
  }

  // 👉 Добавляем создателя в список
  const uniqueMembers = Array.from(new Set([...parsedMembers, currentUserId as string]));

  // 👉 Валидация через Zod
  const result = createGroupSchema.safeParse({
    title,
    description,
    members: uniqueMembers,
    currentUserId,
  });

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    return {
      errors: {
        title: fieldErrors.title?.[0],
        members: fieldErrors.members?.[0],
      },
    };
  }

  const { title: validTitle, description: validDescription, members } = result.data;

  try {
    const groupId = await sql.begin(async (tx: any) => {
      // 1. Создаём группу
      const [group] = await tx`
			INSERT INTO groups (title, description, created_by)
			VALUES (${validTitle}, ${validDescription || null}, ${currentUserId})
			RETURNING id
		 `;

      // 2. Добавляем участников
      await tx`
		INSERT INTO group_members (
		  group_id,
		  profile_id,
		  role,
		  status,
		  invited_by,
		  joined_at,
		  invited_at
		)
		SELECT
		  ${group.id},
		  m.member_id,
		  CASE
			 WHEN m.member_id = ${currentUserId} THEN 'admin'
			 ELSE 'member'
		  END,
		  CASE
			 WHEN m.member_id = ${currentUserId} THEN 'accepted'
			 ELSE 'pending'
		  END,
		  ${currentUserId},
		  CASE
			 WHEN m.member_id = ${currentUserId} THEN NOW()
			 ELSE NULL
		  END,
		  NOW()
		FROM UNNEST(${members}::uuid[]) AS m(member_id)
	 `;

      revalidatePath("/groups");
      // revalidatePath(`/groups/${group.id}`);

      return group.id;
    });

    redirect(`/groups/${groupId}`);

    return { success: true, groupId: groupId };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Ошибка при создании группы:", error);
    return {
      errors: {
        general: "Не удалось создать группу",
      },
    };
  }
}

export type ActionInviteState = {
  success?: boolean;
  error?: string;
};

export async function actionInvite(prevState: ActionInviteState, formData: FormData): Promise<ActionInviteState> {
  const session = await auth();

  const currentUserId = session?.user?.id;

  if (!currentUserId) {
    return { success: false, error: "Unauthorized" };
  }

  const groupId = formData.get("groupId") as string;
  const memberId = formData.get("memberId") as string;
  const action = formData.get("action") as "accept" | "decline" | "resend" | "delete";

  if (!groupId || !memberId || !action) {
    return { success: false, error: "Missing data" };
  }

  // Проверка прав для accept/decline
  if (action === "accept" || action === "decline") {
    if (currentUserId !== memberId) {
      return { success: false, error: "You can only accept/decline your own invitations" };
    }
  }

  // Проверка прав для send/delete (должен быть invited_by)
  if (action === "resend" || action === "delete") {
    const [invitation] = await sql`
		 SELECT invited_by
		 FROM group_members
		 WHERE group_id = ${groupId}
			AND profile_id = ${memberId}
	  `;

    if (!invitation || invitation.invited_by !== currentUserId) {
      return { success: false, error: "You don't have permission to do this action" };
    }
  }

  // Обработка delete
  if (action === "delete") {
    try {
      await sql`
			DELETE FROM group_members
			WHERE group_id = ${groupId}
			  AND profile_id = ${memberId}
		 `;

      revalidatePath("/groups");
      return { success: true };
    } catch (error) {
      console.error("actionInvite delete error:", error);
      return { success: false, error: "DB error" };
    }
  }

  let status: "accepted" | "declined" | "pending";

  switch (action) {
    case "accept":
      status = "accepted";
      break;
    case "decline":
      status = "declined";
      break;
    case "resend":
      status = "pending";
      break;
    default:
      return { success: false, error: "Invalid action" };
  }

  try {
    await sql`
		 UPDATE group_members
		 SET 
			status = ${status},
			invited_at = CASE WHEN ${action} = 'send' THEN NOW() ELSE invited_at END,
			joined_at = CASE WHEN ${action} = 'accept' THEN NOW() ELSE joined_at END
		 WHERE group_id = ${groupId}
			AND profile_id = ${memberId}
	  `;

    revalidatePath("/groups");
    return { success: true };
  } catch (error) {
    console.error("actionInvite error:", error);
    return { success: false, error: "DB error" };
  }
}
