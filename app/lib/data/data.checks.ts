import postgres from "postgres";
import {  CreateCheckParticipantsCardsType } from "../types/types.checks";

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
 

			AND EXISTS (
			  SELECT 1
			  FROM group_members gm2
			  WHERE gm2.group_id = ${groupId}
				 AND gm2.profile_id = ${currentUserId}
			)
 
		 ORDER BY p.username ASC
	  `) as CreateCheckParticipantsCardsType[];

    return members;
  } catch (error) {
    console.error("Ошибка получения участников группы:", error);
    throw error;
  }
}
