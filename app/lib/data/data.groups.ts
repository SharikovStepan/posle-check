import postgres from "postgres";
import { GetGroupsOptions, Group, GroupCardType, GroupListResult, GroupMemberCard, GroupMemberCardQuery, GroupQuery } from "../types/types.groups";
import { CheckByUserCardType, CheckToUserCardType } from "../types/types.checks";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// export async function getGroupsList(options: GetGroupsOptions): Promise<GroupListResult> {
//   const { currentUserId, filter = "all", search, sortBy = "date", order = "desc", limit = 10, currentPage = 1 } = options;

//   try {
//     let whereCondition;

//     switch (filter) {
//       case "all":
//         whereCondition = sql`
// 			  gm.profile_id = ${currentUserId}
// 			`;
//         break;

//       case "created_by_me":
//         whereCondition = sql`
// 			  gm.profile_id = ${currentUserId}
// 			  AND g.created_by = ${currentUserId}
// 			`;
//         break;

//       case "created_by_others":
//         whereCondition = sql`
// 			  gm.profile_id = ${currentUserId}
// 			  AND g.created_by != ${currentUserId}
// 			`;
//         break;

//       default:
//         throw new Error("Invalid groups filter");
//     }

//     const searchCondition = search
//       ? sql`
// 			AND LOWER(g.title) LIKE ${"%" + search.toLowerCase() + "%"}
// 		 `
//       : sql``;

//     // 1️⃣ COUNT
//     const [{ count }] = await sql<{ count: number }[]>`
// 		 SELECT COUNT(DISTINCT g.id)::int as count
// 		 FROM groups g
// 		 JOIN group_members gm ON gm.group_id = g.id
// 		 WHERE ${whereCondition}
// 		 ${searchCondition}
// 	  `;

//     const total = count ?? 0;
//     const totalPages = Math.ceil(total / limit);
//     const offset = limit * (currentPage - 1);

//     const sortColumn = sortBy === "name" ? sql`g.title` : sql`g.created_at`;
//     const sortOrder = order === "asc" ? sql`ASC` : sql`DESC`;

//     // 2️⃣ DATA
//     const groups = await sql<GroupCardType[]>`
//          SELECT
//             g.id,
//             g.title,
//             g.description,
//             g.icon_url,

//             json_build_object(
//               'id', creator.id,
//               'username', creator.username,
//               'full_name', creator.full_name,
//               'avatar_url', creator.avatar_url
//             ) AS created_by,

//             g.created_at,
//             g.updated_at,

//             gm.role AS current_user_role,
// 				gm.status AS current_user_status,

//             COUNT(DISTINCT gm_all.profile_id)::int AS members_count,
//             COUNT(DISTINCT c.id)::int AS checks_count,

//             ARRAY(
//               SELECT p.avatar_url
//               FROM (
//                 SELECT g.created_by AS profile_id, 0 AS sort_order, g.created_at

//                 UNION ALL

//                 SELECT gm2.profile_id, 1 AS sort_order, gm2.joined_at
//                 FROM group_members gm2
//                 WHERE gm2.group_id = g.id
//                   AND gm2.profile_id != g.created_by
//               ) AS members
//               LEFT JOIN profiles p ON p.id = members.profile_id
//               ORDER BY members.sort_order ASC, members.created_at ASC
//               LIMIT 3
//             ) AS avatars

//          FROM groups g

//          JOIN group_members gm
//            ON gm.group_id = g.id
//           AND gm.profile_id = ${currentUserId}

//          LEFT JOIN group_members gm_all ON gm_all.group_id = g.id
//          LEFT JOIN checks c ON c.group_id = g.id
//          LEFT JOIN profiles creator ON creator.id = g.created_by

//          WHERE ${whereCondition}
//          ${searchCondition}

//          GROUP BY g.id, creator.id, gm.role, gm.status

//          ORDER BY ${sortColumn} ${sortOrder}
//          LIMIT ${limit}
//          OFFSET ${offset}
//         `;

//     return {
//       groups: groups,
//       total,
//       totalPages,
//       page: currentPage,
//     };
//   } catch (error) {
//     console.error("Ошибка при получении групп:", error);
//     throw new Error("Не удалось получить группы");
//   }
// }

export async function getGroupsList(options: GetGroupsOptions): Promise<GroupListResult> {
  const { currentUserId, filter = "all", search, sortBy = "date", order = "desc", limit = 10, currentPage = 1 } = options;
  try {
    let whereCondition;
    switch (filter) {
      case "all":
        whereCondition = sql`gm.profile_id = ${currentUserId}`;
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
    const searchCondition = search ? sql`AND LOWER(g.title) LIKE ${"%" + search.toLowerCase() + "%"}` : sql``;

    // 1️⃣ COUNT
    const [{ count }] = await sql<{ count: number }[]>`
		 SELECT COUNT(DISTINCT g.id)::int AS count
		 FROM groups g
		 JOIN group_members gm ON gm.group_id = g.id AND ${whereCondition}
		 ${searchCondition}
	  `;
    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);
    const offset = limit * (currentPage - 1);

    const sortColumn = sortBy === "name" ? sql`g.title` : sql`g.created_at`;
    const sortOrder = order === "asc" ? sql`ASC` : sql`DESC`;

    // 2️⃣ DATA with isNewEvents
    const groups = await sql<GroupCardType[]>`
		 SELECT
			g.id,
			g.title,
			g.description,
			g.icon_url,
			json_build_object(
			  'id', creator.id,
			  'username', creator.username,
			  'full_name', creator.full_name,
			  'avatar_url', creator.avatar_url
			) AS created_by,
			g.created_at,
			g.updated_at,
			gm.role AS current_user_role,
			gm.status AS current_user_status,
			COUNT(DISTINCT gm_all.profile_id)::int AS members_count,
			COUNT(DISTINCT c.id)::int AS checks_count,
			ARRAY(
			  SELECT p.avatar_url
			  FROM (
				 SELECT g.created_by AS profile_id, 0 AS sort_order, g.created_at
				 UNION ALL
				 SELECT gm2.profile_id, 1 AS sort_order, gm2.joined_at
				 FROM group_members gm2
				 WHERE gm2.group_id = g.id
					AND gm2.profile_id != g.created_by
			  ) AS members
			  LEFT JOIN profiles p ON p.id = members.profile_id
			  ORDER BY members.sort_order ASC, members.sort_order ASC
			  LIMIT 3
			) AS avatars,
			(
			  /* Сценарий 1: есть чужие чеки с моим участием без оплаты или отклонённой оплатой */
			  EXISTS(
				 SELECT 1
				 FROM checks c1
				 JOIN check_participants cp ON cp.check_id = c1.id
				 LEFT JOIN payments p1 ON p1.check_id = c1.id AND p1.payer_id = cp.profile_id
				 WHERE c1.group_id = g.id
					AND c1.created_by != ${currentUserId}
					AND cp.profile_id = ${currentUserId}
					AND cp.participated = TRUE
					AND (p1.id IS NULL OR p1.status = 'declined')
			  )
			  /* OR Сценарий 2: есть мои чеки с оплатами в статусе pending */
			  OR EXISTS(
				 SELECT 1
				 FROM checks c2
				 LEFT JOIN payments p2 ON p2.check_id = c2.id
				 WHERE c2.group_id = g.id
					AND c2.created_by = ${currentUserId}
					AND p2.status = 'pending'
			  )
			) AS is_new_events
		 FROM groups g
		 JOIN group_members gm
			ON gm.group_id = g.id
		  AND gm.profile_id = ${currentUserId}
		 LEFT JOIN group_members gm_all ON gm_all.group_id = g.id
		 LEFT JOIN checks c ON c.group_id = g.id
		 LEFT JOIN profiles creator ON creator.id = g.created_by
		 WHERE ${whereCondition}
			${searchCondition}
		 GROUP BY g.id, creator.id, gm.role, gm.status
		 ORDER BY ${sortColumn} ${sortOrder}
		 LIMIT ${limit}
		 OFFSET ${offset}
	  `;
    return { groups, total, totalPages, page: currentPage };
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
				AND gm2.status = 'accepted'
		  )
	 
		GROUP BY g.id
	 `;

    if (!group) throw new Error("Нет доступа к группе, возможно нужно принять приглашение");

    const members = (await sql`
      SELECT
        p.id,
        p.username,
        p.avatar_url,
		  p.full_name,
		  gm.role,
		  gm.status,
		  gm.invited_by
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
		  )::int AS paid_participants_count,
	 
		  COALESCE((
			 SELECT cp.participated
			 FROM check_participants cp
			 WHERE cp.check_id = c.id
				AND cp.profile_id = c.created_by
				AND cp.participated = true
			 LIMIT 1
		  ), false) AS creator_participating,
	 

		  EXISTS (
			 SELECT 1
			 FROM payments p
			 WHERE p.check_id = c.id
				AND p.status = 'pending'
		  ) AS is_pending_payments
	 
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
	 
		  cp.participated,
	 
		  cp.share_amount::float8 AS share_amount,
	 
		  -- статус платежа
		  COALESCE(p_last.status, 'unpaid') AS payment_status,
	 
		  -- сумма последнего платежа
		  p_last.amount::float8 AS payment_amount
	 
		FROM checks c
	 
		LEFT JOIN check_participants cp
		  ON cp.check_id = c.id
		 AND cp.profile_id = ${currentUserId}
	 
		-- последний платеж пользователя по чеку
		LEFT JOIN LATERAL (
		  SELECT
			 p.status,
			 p.amount
		  FROM payments p
		  WHERE p.check_id = c.id
			 AND p.payer_id = ${currentUserId}
		  ORDER BY p.created_at DESC
		  LIMIT 1
		) p_last ON true
	 
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
