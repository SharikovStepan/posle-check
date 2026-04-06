import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Yandex from "next-auth/providers/yandex";
import { authConfig } from "./auth.config";
import postgres from "postgres";
import { Profile } from "./app/lib/types/types.user";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function getUser(email: string): Promise<Profile | undefined> {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await sql<Profile[]>`SELECT * FROM profiles WHERE LOWER(email) = ${normalizedEmail}`;
    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

function generateUsername(fullName: string): string {
  const cleaned = fullName.trim().toLowerCase();

  const words = cleaned.split(/\s+/);

  let username: string;

  if (words.length === 1) {
    username = words[0];
  } else {
    username = words.join("_");
  }
  username = username.replace(/[^a-z0-9._]/g, "");
  username = username.slice(0, 30);

  if (!username) {
    username = `user_${Date.now()}`;
  }

  return username;
}

export interface CreateUserParams {
  email: string;
  fullName: string;
  avatar_url?: string | null;
  provider: string;
  provider_id: string;
}

async function createUser(params: CreateUserParams): Promise<{ id: string; username: string }> {
  const { email, fullName, avatar_url, provider, provider_id } = params;

  const normalizedEmail = email.toLowerCase().trim();

  if (!normalizedEmail) {
    throw new Error("Email is required to create user");
  }

  if (!fullName || fullName.trim().length === 0) {
    throw new Error("User must have a name");
  }

  const username = generateUsername(fullName);

  try {
    // postgres.js возвращает массив строк напрямую
    const result = await sql`
	  INSERT INTO profiles (
		 email,
		 username,
		 full_name,
		 avatar_url,
		 provider,
		 provider_id,
		 created_at
	  ) VALUES (
		 ${normalizedEmail},
		 ${username},
		 ${fullName},
		 ${avatar_url || null},
		 ${provider},
		 ${provider_id},
		 NOW()
	  )
	  RETURNING id, username
	`;

    // В postgres.js result - это массив строк
    // Если ничего не вернулось - массив пустой
    if (!result || result.length === 0) {
      throw new Error("Failed to create user: no data returned");
    }

    // Первая строка результата
    const newUser = result[0];

    return {
      id: newUser.id,
      username: newUser.username,
    };
  } catch (error) {
    console.error("Failed to create user:", error);
    throw new Error("Failed to create user.");
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Yandex({
      clientId: process.env.AUTH_YANDEX_ID,
      clientSecret: process.env.AUTH_YANDEX_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log("user", user);
        console.log("account", account);
        console.log("profile", profile);

        if (account?.provider !== "google" && account?.provider !== "yandex") {
          return false;
        }

        if (!user?.email) {
          console.error("No email from Google");
          return false;
        }

        const normalizedEmail = user.email.toLowerCase().trim();

        const existingUser = await getUser(normalizedEmail);

        if (!existingUser) {
          // Проверяем, что есть имя
          if (!user.name) {
            console.error("No name from Google");
            return false;
          }

          // ✅ Ждем создания пользователя
          const newUser = await createUser({
            email: normalizedEmail,
            fullName: user.name,
            avatar_url: user.image,
            provider: account.provider,
            provider_id: account.providerAccountId,
          });

          // Проверяем, что пользователь действительно создался
          if (!newUser) {
            console.error("Failed to create user");
            return false; //
          }
        }

        return true;
      } catch (error) {
        console.error("Ошибка в signIn:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      try {
        if (user && user.email) {
          console.log("🔑 JWT callback - first time login");
          const dbUser = await getUser(user.email.toLowerCase());

          if (dbUser) {
            token.dbId = dbUser.id;
            console.log("✅ User ID added to token:", dbUser.id);
          } else {
            console.log("⚠️ User not found in DB");
          }
        }

        return token;
      } catch (error) {
        console.error("❌ Error in jwt callback:", error);
        // ВАЖНО: даже при ошибке возвращаем токен, чтобы не ломать аутентификацию
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (token.dbId) {
          session.user.id = token.dbId;
        } else {
          console.log("⚠️ No dbId in token");
        }

        return session;
      } catch (error) {
        console.error("❌ Error in session callback:", error);
        return session;
      }
    },
  },
  session: {
    strategy: "jwt",
  },
});
