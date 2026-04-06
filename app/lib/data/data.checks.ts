import postgres from "postgres";
import { CheckDetailsByUserType, CheckDetailsParticipant, CreateCheckParticipantsCardsType } from "../types/types.checks";
import { GroupMemberCardQuery } from "../types/types.groups";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function getGroupMembers(groupId: string, currentUserId: string): Promise<CreateCheckParticipantsCardsType[]> {
  try {
    const members = (await sql`
		  SELECT
			 p.id,
			 p.username,
			 p.full_name,
			 p.avatar_url
  
		  FROM group_members gm
		  JOIN profiles p ON p.id = gm.profile_id
  
		  WHERE gm.group_id = ${groupId}
			 AND gm.status = 'accepted'
			 AND EXISTS (
				SELECT 1
				FROM group_members gm2
				WHERE gm2.group_id = ${groupId}
				  AND gm2.profile_id = ${currentUserId}
				  AND gm2.status = 'accepted'
			 )
  
		  ORDER BY p.username ASC
		`) as GroupMemberCardQuery[];

    const participantsCardsArray: CreateCheckParticipantsCardsType[] = members.map((member) => {
      const isCreator = member.id == currentUserId;
      if (isCreator) {
        return { ...member, participating: true, amount: 0, isCreator: true };
      } else {
        return { ...member, participating: true, amount: 0, isCreator: false };
      }
    });

    return participantsCardsArray;
  } catch (error) {
    console.error("Ошибка получения участников группы:", error);
    throw error;
  }
}

export async function getCheckDetails(checkId: string, currentUserId: string): Promise<CheckDetailsByUserType> {
  try {
    // 1. Получаем базовую инфу о чеке + creator
    const [check] = await sql`
		  SELECT
			 c.id,
			 c.title,
			 c.icon_url,
			 c.photo_url,
			 c.description,
			 c.total_amount,
			 c.created_by,
			 c.created_at,
		
			 COALESCE((
				SELECT SUM(p.amount)
				FROM payments p
				WHERE p.check_id = c.id
				  AND p.status = 'confirmed'
			 ), 0)::float8 AS paid_amount,
		
			 (
				SELECT COUNT(DISTINCT p.payer_id)
				FROM payments p
				WHERE p.check_id = c.id
				  AND p.status = 'confirmed'
				  AND p.payer_id != c.created_by
			 )::int AS paid_count,
		
			 pr.id AS creator_id,
			 pr.avatar_url,
			 pr.username,
			 pr.full_name,
		
			 cp.participated AS creator_participating,
			 cp.share_amount::float8 AS creator_amount
		
		  FROM checks c
		  JOIN profiles pr ON pr.id = c.created_by
		
		  LEFT JOIN check_participants cp
			 ON cp.check_id = c.id
			AND cp.profile_id = c.created_by
		
		  WHERE c.id = ${checkId}
		`;

    if (!check) throw new Error("Чек не найден");

    const isCreator = check.created_by === currentUserId;

    // 2. Проверка доступа (если не creator — должен быть участником)
    if (!isCreator) {
      const [participant] = await sql`
			 SELECT 1
			 FROM check_participants cp
			 WHERE cp.check_id = ${checkId}
				AND cp.profile_id = ${currentUserId}
				AND cp.participated = true
			 LIMIT 1
		  `;

      if (!participant) {
        throw new Error("Нет доступа к чеку");
      }
    }

    // 3. Получаем участников с сортировкой по username
    const participants = (await sql`
		 SELECT
			pr.id,
			pr.username,
			pr.full_name,
			pr.avatar_url,
			cp.share_amount::float8 AS share_amount,
	  
			-- payments
			COALESCE((
			  SELECT json_agg(
				 json_build_object(
					'id', p2.id,
					'amount', p2.amount::float8,
					'status', p2.status
				 )
				 ORDER BY p2.updated_at DESC
			  )
			  FROM payments p2
			  WHERE p2.check_id = ${checkId}
				 AND p2.payer_id = pr.id
			), '[]'::json) AS payments
	  
		 FROM check_participants cp
		 JOIN profiles pr ON pr.id = cp.profile_id
	  
		 WHERE cp.check_id = ${checkId}
			AND cp.participated = true
			AND (
			  ${isCreator}
			  OR pr.id = ${currentUserId}
			)
			AND pr.id != ${check.created_by}
	  
		 ORDER BY pr.username ASC
	  `) as CheckDetailsParticipant[];

    // 4. Финальный объект
    return {
      id: check.id,
      title: check.title,
      icon_url: check.icon_url,
      photo_url: check.photo_url,
      description: check.description,
      total_amount: Number(check.total_amount),
      paid_amount: Number(check.paid_amount),
      paid_count: check.paid_count,
      created_at: check.created_at,

      creator: {
        id: check.creator_id,
        username: check.username,
        full_name: check.full_name,
        avatar_url: check.avatar_url,
        participating: check.creator_participating ?? false,
        amount: check.creator_amount ?? 0,
      },

      participants: participants,
    };
  } catch (error) {
    console.error("Ошибка получения чека:", error);
    throw error;
  }
}
