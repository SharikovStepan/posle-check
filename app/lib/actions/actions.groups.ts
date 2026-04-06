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
		  ${currentUserId},
		  NOW(),
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
