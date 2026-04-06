// app/api/friends/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getFriendsList } from "@/app/lib/data/data.friendship";
import { GetFriendsOptions } from "@/app/lib/types/types.friends";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    // 1. Получаем параметры из URL

    const session = await auth();

    // Проверяем авторизацию
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;

    const options: GetFriendsOptions = {
      currentUserId: session.user.id,
      filter: (searchParams.get("filter") as any) || "friends",
      search: searchParams.get("search") || undefined,
      sortBy: (searchParams.get("sortBy") as any) || "date",
      order: (searchParams.get("order") as any) || "asc",
      limit: Number(searchParams.get("limit")) || 5,
      currentPage: Number(searchParams.get("page")) || 1,
    };

    // 2. Валидируем обязательные параметры
    if (!options.currentUserId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // 3. Вызываем существующую функцию
    const result = await getFriendsList(options);

    // 4. Возвращаем JSON
    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
