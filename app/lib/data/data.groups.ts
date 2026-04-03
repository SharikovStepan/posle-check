import postgres from "postgres";
import { GetGroupsOptions, Group, GroupCardType, GroupListResult, GroupMemberCard, GroupMemberCardQuery, GroupQuery } from "../types/types.groups";
import { CheckByUserCardType, CheckToUserCardType } from "../types/types.checks";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function getGroupsList(options: GetGroupsOptions): Promise<GroupListResult> {
  const { currentUserId, filter = "all", search, sortBy = "date", order = "desc", limit = 10, currentPage = 1 } = options;

  try {
    let whereCondition;

    switch (filter) {
      case "all":
        whereCondition = sql`
			  gm.profile_id = ${currentUserId}
			`;
        break;

      case "created_by_me":
        whereCondition = sql`
			  gm.profile_id = ${currentUserId}
			  AND g.created_by = ${currentUserId}
			`;
        break;

      case "created_by_others":
        whereCondition = sql`
			  gm.profile_id = ${currentUserId}
			  AND g.created_by != ${currentUserId}
			`;
        break;

      default:
        throw new Error("Invalid groups filter");
    }

    const searchCondition = search
      ? sql`
			AND LOWER(g.title) LIKE ${"%" + search.toLowerCase() + "%"}
		 `
      : sql``;

    // 1️⃣ COUNT
    const [{ count }] = await sql<{ count: number }[]>`
		 SELECT COUNT(DISTINCT g.id)::int as count
		 FROM groups g
		 JOIN group_members gm ON gm.group_id = g.id
		 WHERE ${whereCondition}
		 ${searchCondition}
	  `;

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);
    const offset = limit * (currentPage - 1);

    const sortColumn = sortBy === "name" ? sql`g.title` : sql`g.created_at`;
    const sortOrder = order === "asc" ? sql`ASC` : sql`DESC`;

    // 2️⃣ DATA
    const groups = await sql<GroupCardType[]>`
	 SELECT
		g.id,
		g.title,
		g.description,
		g.icon_url,
		g.created_by,
		g.created_at,
		g.updated_at,
  
		COUNT(DISTINCT gm_all.profile_id)::int AS members_count,
		COUNT(DISTINCT c.id)::int AS checks_count,
  
		ARRAY(
		  SELECT p.avatar_url
		  FROM (
			 -- создатель (всегда первый)
			 SELECT g.created_by AS profile_id, 0 AS sort_order, g.created_at AS created_at
  
			 UNION ALL
  
			 -- остальные участники
			 SELECT gm2.profile_id, 1 AS sort_order, gm2.joined_at
			 FROM group_members gm2
			 WHERE gm2.group_id = g.id
				AND gm2.profile_id != g.created_by
		  ) AS members
		  LEFT JOIN profiles p ON p.id = members.profile_id
		  ORDER BY members.sort_order ASC, members.created_at ASC
		  LIMIT 3
		) AS avatars
  
	 FROM groups g
  
	 -- участники для фильтра
	 JOIN group_members gm ON gm.group_id = g.id
  
	 -- все участники для подсчёта
	 LEFT JOIN group_members gm_all ON gm_all.group_id = g.id
  
	 -- чеки
	 LEFT JOIN checks c ON c.group_id = g.id
  
	 WHERE ${whereCondition}
	 ${searchCondition}
  
	 GROUP BY g.id
  
	 ORDER BY ${sortColumn} ${sortOrder}
	 LIMIT ${limit}
	 OFFSET ${offset}
  `;

    return {
      groups: groups,
      total,
      totalPages,
      page: currentPage,
    };
  } catch (error) {
    console.error("Ошибка при получении групп:", error);
    throw new Error("Не удалось получить группы");
  }
}

export async function getGroupDetails(groupId: string, currentUserId: string): Promise<Group> {
  try {
    const [group] = await sql<GroupQuery[]>`
		SELECT
		  g.id,
		  g.title,
		  g.description,
		  g.icon_url,
	 
		  COUNT(DISTINCT gm.profile_id)::int AS members_count,
		  COUNT(DISTINCT c.id)::int AS checks_count
	 
		FROM groups g
		JOIN group_members gm ON gm.group_id = g.id
		LEFT JOIN checks c ON c.group_id = g.id
	 
		WHERE g.id = ${groupId}
		  AND EXISTS (
			 SELECT 1
			 FROM group_members gm2
			 WHERE gm2.group_id = g.id
				AND gm2.profile_id = ${currentUserId}
		  )
	 
		GROUP BY g.id
	 `;

    if (!group) throw new Error("Нет доступа к группе");

    const members = (await sql`
      SELECT
        p.id,
        p.username,
        p.avatar_url,
		  p.full_name
      FROM group_members gm
      JOIN profiles p ON p.id = gm.profile_id
      WHERE gm.group_id = ${groupId}
        AND gm.role != 'blocked'
    `) as GroupMemberCardQuery[];

    const checksByUser = (await sql`
		SELECT
		  c.id,
		  c.title,
		  c.icon_url,
		  c.total_amount,
		  c.created_at,
	 
		  COALESCE((
			 SELECT SUM(p.amount)
			 FROM payments p
			 WHERE p.check_id = c.id
				AND p.status = 'confirmed'
		  ), 0)::numeric AS paid_amount,
	 
		  (
			 SELECT COUNT(*)
			 FROM check_participants cp
			 WHERE cp.check_id = c.id
				AND cp.participated = true
		  )::int AS participants_count,
	 
		  (
			 SELECT COUNT(DISTINCT p.payer_id)
			 FROM payments p
			 WHERE p.check_id = c.id
				AND p.status = 'confirmed'
				AND p.payer_id != c.created_by
		  )::int AS paid_participants_count
	 
		FROM checks c
		WHERE c.group_id = ${groupId}
		  AND c.created_by = ${currentUserId}
	 
		ORDER BY c.created_at DESC
	 `) as CheckByUserCardType[];

    const unpaidCounts = (await sql`
      SELECT
        cp.profile_id,
        COUNT(*)::int AS unpaid_checks_count
      FROM check_participants cp
    
      JOIN checks c ON c.id = cp.check_id
    
      LEFT JOIN payments p
        ON p.check_id = cp.check_id
       AND p.payer_id = cp.profile_id
       AND p.status = 'confirmed'
    
      WHERE c.group_id = ${groupId}
        AND cp.participated = true
        AND p.id IS NULL
    
      GROUP BY cp.profile_id
    `) as { profile_id: string; unpaid_checks_count: number }[];

    const map = new Map(unpaidCounts.map((u) => [u.profile_id, u.unpaid_checks_count]));

    const membersWithCounts: GroupMemberCard[] = members.map((member) => ({
      ...member,
      unpaid_checks_count: map.get(member.id) ?? 0,
    }));

    const checksToUser = (await sql`
		SELECT
		  c.id,
		  c.title,
		  c.icon_url,
		  c.created_at,
	 
		  -- участвовал ли
		  cp.participated,
	 
		  -- сколько должен
		  cp.share_amount,
	 
		  -- оплатил ли
		  EXISTS (
			 SELECT 1
			 FROM payments p
			 WHERE p.check_id = c.id
				AND p.payer_id = ${currentUserId}
				AND p.status = 'confirmed'
		  ) AS is_paid
	 
		FROM checks c
	 
		LEFT JOIN check_participants cp
		  ON cp.check_id = c.id
		 AND cp.profile_id = ${currentUserId}
	 
		WHERE c.group_id = ${groupId}
		  AND c.created_by != ${currentUserId}
	 
		ORDER BY c.created_at DESC
	 `) as CheckToUserCardType[];

    return {
      ...group,
      members: membersWithCounts,
      checksByUser,
      checksToUser,
    };
  } catch (error) {
    console.error("Ошибка получения группы:", error);
    throw error;
  }
}

//  const unpaidIdsByUsers = await sql`
//    SELECT
//      cp.profile_id,

//      json_agg(c.id) AS unpaid_checks

//    FROM check_participants cp

//    JOIN checks c ON c.id = cp.check_id

//    -- ❗ ключевая часть
//    LEFT JOIN payments p
//      ON p.check_id = cp.check_id
//     AND p.payer_id = cp.profile_id
//     AND p.status = 'confirmed'

//    WHERE c.group_id = ${groupId}
//      AND cp.participated = true

//      -- 💥 только те, где НЕТ платежа
//      AND p.id IS NULL

//    GROUP BY cp.profile_id
//  `;

//  const unpaidIdsMap = new Map(unpaidIdsByUsers.map((u) => [u.profile_id, u.unpaid_checks]));

//  const membersWithUnpaid = members.map((member) => ({
//    ...member,
//    unpaid_checks: unpaidIdsMap.get(member.id) ?? [],
//  }));
