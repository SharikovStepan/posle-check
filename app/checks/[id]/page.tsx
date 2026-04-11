import CheckPage from "@/app/ui/checks/checkPage";
import PageHeader from "@/app/ui/pageHeader";
import { Suspense } from "react";

import { Metadata } from "next";
import SpinnerLoadingPage from "@/app/lib/fallbacks/spinnerLoadingPage";
import { CheckDetailsSkeleton } from "@/app/lib/fallbacks/checkPageSkeleton";
export const metadata: Metadata = {
  title: "Чек",
};

export default function Page(props: { params: Promise<{ id: string }> }) {

  return (
    <>
      <div className="flex flex-col md:grid md:grid-rows-[100_auto] gap-3 w-full">
        <Suspense fallback={<CheckDetailsSkeleton />}>
          <CheckPage pageParams={props.params} />
        </Suspense>
      </div>
    </>
  );
}
