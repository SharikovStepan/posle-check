import { Suspense } from "react";
import LoginForm from "../ui/login/loginForm";
import PageHeader from "../ui/pageHeader";

import { Metadata } from "next";
import LoginFormSkeleton from "../lib/fallbacks/loginFormSkeleton";
export const metadata: Metadata = {
  title: "Вход",
};

export default function Page({ searchParams }: { searchParams?: Promise<{ callbackUrl?: string }> }) {
  return (
    <>
      <main className="flex flex-col md:grid md:grid-rows-[100_auto] gap-3 w-full">
        <PageHeader title={"Вход"} />
        <div className="rounded-md bg-bg-secondary p-3 flex justify-center items-center">
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm searchParamsPromise={searchParams} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
