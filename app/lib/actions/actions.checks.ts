"use server";

import postgres, { Sql, TransactionSql } from "postgres";
import { CreateCheckActionData } from "../types/types.checks";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const ParticipantSchema = z.object({
  id: z.string().min(1),
  amount: z.number(),
});

const CreatorSchema = z.object({
  id: z.string().min(1),
  participating: z.boolean(),
  amount: z.number(),
});

const CreateCheckSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
  totalAmount: z.number().refine((val) => val !== 0, {
    message: "Amount must not be 0",
  }),
  creator: CreatorSchema,
  participants: z.array(ParticipantSchema).min(1, "At least one participant is required"),
});

export async function createCheckAction(data: CreateCheckActionData, groupId: string): Promise<{ success: boolean; error?: string }> {
  const parsed = CreateCheckSchema.safeParse(data);

  if (!parsed.success) {
    console.error("Validation error:", z.flattenError(parsed.error));
    return {
      success: false,
      error: "Invalid input data",
    };
  }

  const { title, description, totalAmount, creator, participants } = parsed.data;

  try {
    const newCheckId = await sql.begin(async (tx: any): Promise<string> => {
      const [check] = await tx`
			INSERT INTO checks (
			  group_id,
			  created_by,
			  title,
			  description,
			  total_amount,
			  status
			)
			VALUES (
			  ${groupId},
			  ${creator.id},
			  ${title},
			  ${description},
			  ${totalAmount},
			  'open'
			)
			RETURNING id
		 `;

      const checkId = check.id;

      // creator
      await tx`
			INSERT INTO check_participants (
			  check_id,
			  profile_id,
			  participated,
			  share_amount,
			  added_by
			)
			VALUES (
			  ${checkId},
			  ${creator.id},
			  ${creator.participating},
			  ${creator.participating ? (creator.amount !== 0 ? creator.amount : null) : null},
			  ${creator.id}
			)
		 `;

      // participants (исключаем creator)
      const filtered = participants.filter((p) => p.id !== creator.id);

      if (filtered.length > 0) {
        const values = filtered.map((p) => [checkId, p.id, true, p.amount !== 0 ? p.amount : null, creator.id]);

        await tx`
			  INSERT INTO check_participants (
				 check_id,
				 profile_id,
				 participated,
				 share_amount,
				 added_by
			  )
			  VALUES ${tx(values)}
			`;
      }

      if (creator.participating) {
        await tx`
          INSERT INTO payments (
            check_id,
            payer_id,
            amount,
            type,
            status,
            created_by,
            confirmed_at,
				paid_at
          )
          VALUES (
            ${checkId},
            ${creator.id},
            ${creator.amount},
            'creator',
            'confirmed',
            ${creator.id},
            now(),
				now()
          )
        `;
      }
      revalidatePath("/checks");
      revalidatePath(`/groups/${groupId}`);

      return checkId;
    });

    redirect(`/checks/${newCheckId}`);

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.error("Ошибка создания чека:", error);
    return { success: false, error: "DB Fail" };
  }
}
