import ProfileCardSkeleton from "@/app/lib/fallbacks/profileCardSkeleton";
import ProfileCard from "./profileCard";
import { Suspense } from "react";

export default function ProfilePage() {
  return (
    <>
      <div className="flex flex-col gap-2 justify-center items-center">
        <Suspense fallback={<ProfileCardSkeleton />}>
          <ProfileCard />
        </Suspense>
        <h3 className="text-text-primary text-base sm:text-lg text-center text-nowrap">Позже здесь будет страница профиля</h3>
        <p className="text-text-tertiary/80 text-sm ">А пока можно сменить тему </p>
      </div>
    </>
  );
}
