"use client";

import { useSession } from "next-auth/react";
import ProfileCard from "./profileCard";

export default function ProfilePage() {
  const session = useSession();
  console.log("session", session);

  return (
    <>
      <div className="flex flex-col gap-2 justify-center items-center">
        <ProfileCard name={session.data?.user.name || "noname"} avatar_url={session.data?.user.image || ""} />

        <h3 className="text-text-primary text-lg text-center">Позже здесь будет страница профиля</h3>
        <p className="text-text-tertiary/80 text-sm">А пока можно сменить тему </p>
      </div>
    </>
  );
}
