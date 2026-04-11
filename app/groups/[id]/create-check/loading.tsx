import CreateCheckPageSkeleton from "@/app/lib/fallbacks/createCheckSkeleton";
import SpinnerLoadingPage from "@/app/lib/fallbacks/spinnerLoadingPage";

export default function Loading() {
  return (
    <>
      <CreateCheckPageSkeleton />
    </>
  );
}
