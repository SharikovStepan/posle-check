"use client";

import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const session = useSession();
  console.log("session", session);

  return (
    <>
      <div className="flex flex-col gap-2 justify-center items-center">
        <h3 className="text-text-primary text-lg">Позже здесь будет страница профиля</h3>
        <p className="text-text-tertiary/80 text-sm">А пока можно сменить тему </p>
      </div>
    </>
  );
}
