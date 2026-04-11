import { SessionProvider } from "next-auth/react";
import SignOut from "../ui/login/signOut";
import PageHeader from "../ui/pageHeader";
import ProfilePage from "../ui/profile/profilePage";
import ThemeToggle from "../ui/themeToggle";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Профиль",
};

export default async function Page() {
	await new Promise((resolve) => setTimeout(resolve, 3000));
	return (
    <>
      <div className="flex flex-col md:grid md:grid-rows-[100_auto] gap-3 w-full">
        <PageHeader title={"Профиль"} />
        <div className="rounded-md h-full p-3 bg-bg-secondary flex flex-col justify-center items-center gap-3">
          <ProfilePage />
          <ThemeToggle />

          <SignOut />
        </div>
      </div>
    </>
  );
}
