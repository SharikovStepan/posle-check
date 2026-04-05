import CheckPage from "@/app/ui/checks/checkPage";
import PageHeader from "@/app/ui/pageHeader";
import { Suspense } from "react";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  return (
    <>
      <div className="flex flex-col md:grid md:grid-rows-[100_auto] gap-3 w-full">
        <Suspense fallback={<div>LOAD CHECK</div>}>
          <CheckPage checkId={id} />
        </Suspense>
      </div>
    </>
  );
}
