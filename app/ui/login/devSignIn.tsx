// app/ui/login/devSignIn.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function DevSignIn() {
  const [uuid, setUuid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError("");

    const userId = formData.get("userId") as string;

    try {
      const result = await signIn("dev-uuid", {
        userId: userId,
        redirect: false,
        callbackUrl: "/profile",
      });

      // Если ошибка - показываем сообщение
      if (result?.error) {
        console.error("SignIn error:", result.error);

        if (result.error === "CredentialsSignin") {
          setError("Invalid UUID or user not found in database");
        } else {
          setError("Login failed. Please try again.");
        }
        return;
      }

      // Если успешно - редиректим вручную
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      // Обрабатываем исключение CredentialsSignin
      console.error("SignIn exception:", error);

      // Проверяем тип ошибки
      if (error instanceof Error) {
        if (error.message === "CredentialsSignin") {
          setError("Invalid UUID or user not found in database");
        } else {
          setError(`Login failed: ${error.message}`);
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          name="userId"
          value={uuid}
          autoComplete="off"
          onChange={(e) => setUuid(e.target.value)}
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-md shadow-sm focus:outline-none focus:ring-(--ring) focus:ring-2"
          disabled={loading}
          pattern="[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
        />
        <p className="mt-1 text-xs text-gray-500">Enter any valid UUID from your development database</p>
      </div>

      {error && (
        <div className="p-3 bg-error rounded-md">
          <p className="text-sm text-text-inverted font-medium text-shadow-md">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-text-inverted bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-text-primary disabled:opacity-50">
        {loading ? "Logging in..." : "Login with UUID"}
      </button>
    </form>
  );
}
