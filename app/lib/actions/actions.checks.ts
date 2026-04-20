"use server";

import postgres, { Sql, TransactionSql } from "postgres";
import { ConfirmPaymentType, CreateCheckActionData, SendPaymentType } from "../types/types.checks";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";
import { auth } from "@/auth";

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
  tipsForParticipant: z.number(),
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

  const { title, description, totalAmount, tipsForParticipant, creator, participants } = parsed.data;

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
			  tips_amount,
			  added_by
			)
			VALUES (
			  ${checkId},
			  ${creator.id},
			  ${creator.participating},
			  ${creator.participating ? (creator.amount !== 0 ? creator.amount : null) : null},
			  ${creator.participating ? (tipsForParticipant !== 0 ? tipsForParticipant : null) : null},
			  ${creator.id}
			)
		 `;

      // participants (исключаем creator)
      const filtered = participants.filter((p) => p.id !== creator.id);

      if (filtered.length > 0) {
        const values = filtered.map((p) => [checkId, p.id, true, p.amount !== 0 ? p.amount : null, tipsForParticipant !== 0 ? tipsForParticipant : null, creator.id]);

        await tx`
			  INSERT INTO check_participants (
				 check_id,
				 profile_id,
				 participated,
				 share_amount,
				 tips_amount,
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
            ${creator.amount + tipsForParticipant},
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

const paymentSchema = z.object({
  payer_id: z.string().min(1),
  check_id: z.string().min(1),

  payment_amount: z
    .string()
    .min(1, "Введите сумму")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val !== 0, {
      message: "Сумма не может быть 0",
    }),
});

export async function createPaymentAction(prevState: SendPaymentType, formData: FormData): Promise<SendPaymentType> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = paymentSchema.safeParse({
    payer_id: session.user.id,
    check_id: formData.get("checkId"),
    payment_amount: formData.get("payment-amount"),
  });

  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);

    return {
      success: false,
      error: {
        payment_amount: fieldErrors.payment_amount?.[0] ?? "",
      },
    };
  }

  const { payer_id, payment_amount, check_id } = parsed.data;

  try {
    // 1. Получаем share_amount
    const [participant] = await sql`
		 SELECT share_amount
		 FROM check_participants
		 WHERE check_id = ${check_id}
			AND profile_id = ${payer_id}
		 LIMIT 1
	  `;

    if (!participant) {
      throw new Error("Участник не найден");
    }

    const type = participant.share_amount == null ? "self" : "request";

    const updated = await sql`
	 UPDATE payments
	 SET
		amount = ${payment_amount},
		status = 'pending',
		updated_at = NOW()
	 WHERE check_id = ${check_id}
		AND payer_id = ${payer_id}
		AND status = 'declined'
	 RETURNING id
  `;

    if (updated.length === 0) {
      await sql`
		INSERT INTO payments (
		  check_id,
		  payer_id,
		  amount,
		  type,
		  status,
		  created_by
		)
		VALUES (
		  ${check_id},
		  ${payer_id},
		  ${payment_amount},
		  ${type},
		  'pending',
		  ${payer_id}
		)
	 `;
    }

    revalidatePath(`/checks/${check_id}`);
    return { success: true };
  } catch (error) {
    console.error("Ошибка создания платежа:", error);
    throw error;
  }
}

const confirmPaymentSchema = z.object({
  paymentId: z.string().min(1, "Payment id is required"),
  checkId: z.string().min(1, "Check id is required"),
  currentUserId: z.string().min(1, "User id is required"),
  action: z.enum(["confirm", "decline"]),
});

export async function confirmPayment(prevState: ConfirmPaymentType, formData: FormData): Promise<ConfirmPaymentType> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = confirmPaymentSchema.safeParse({
    paymentId: formData.get("payment-id"),
    checkId: formData.get("check-id"),
    currentUserId: session.user.id,
    action: formData.get("action"),
  });

  if (!parsed.success) {
    console.error("Validation error:", z.flattenError(parsed.error));
    return { success: false };
  }

  const { paymentId, checkId, currentUserId, action } = parsed.data;

  try {
    // 1. Проверяем, что пользователь — creator чека
    const [check] = await sql`
		 SELECT created_by
		 FROM checks
		 WHERE id = ${checkId}
		 LIMIT 1
	  `;

    if (!check) {
      throw new Error("Чек не найден");
    }

    if (check.created_by !== currentUserId) {
      throw new Error("Нет доступа");
    }

    // 2. Проверяем, что payment существует
    const [payment] = await sql`
		 SELECT id
		 FROM payments
		 WHERE id = ${paymentId}
			AND check_id = ${checkId}
		 LIMIT 1
	  `;

    if (!payment) {
      throw new Error("Платёж не найден");
    }

    // 3. Определяем новый статус
    const newStatus = action === "confirm" ? "confirmed" : "declined";

    // 4. Обновляем платёж
    await sql`
         UPDATE payments
         SET
           status = ${newStatus},
           updated_at = NOW(),
           confirmed_at = ${action === "confirm" ? sql`NOW()` : sql`confirmed_at`}
         WHERE id = ${paymentId}
       `;

    revalidatePath(`/checks/${checkId}`);

    return { success: true };
  } catch (error) {
    console.error("Ошибка подтверждения платежа:", error);
    throw error;
  }
}

export type SelfCheckParticipatingType = {
  success?: boolean;
  error?: string;
};

export async function changeSelfCheckParticipating(prevState: SelfCheckParticipatingType, formData: FormData): Promise<SelfCheckParticipatingType> {
  const session = await auth();

  const currentUserId = session?.user?.id;

  if (!currentUserId) {
    return { success: false, error: "Unauthorized" };
  }

  const checkId = formData.get("checkId") as string;
  const memberId = formData.get("memberId") as string;
  const action = formData.get("participating") as "true" | "false";

  console.log("checkId", checkId);
  console.log("memberId", memberId);
  console.log("action", action);

  return prevState;
}
