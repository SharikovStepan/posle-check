import postgres from "postgres";
import { GetGroupsOptions, Group, GroupListResult } from "../types/types.groups";

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
			AND LOWER(g.name) LIKE ${"%" + search.toLowerCase() + "%"}
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

    const sortColumn = sortBy === "name" ? sql`g.name` : sql`g.created_at`;
    const sortOrder = order === "asc" ? sql`ASC` : sql`DESC`;

    // 2️⃣ DATA
    const groups = await sql<Group[]>`
	 SELECT
		g.id,
		g.name,
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
