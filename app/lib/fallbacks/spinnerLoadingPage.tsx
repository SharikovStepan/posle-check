import TimeoutBackButton from "@/app/ui/groups/timeoutBack";
import Spinner from "@/app/ui/spinner";

export default function SpinnerLoadingPage() {
  return (
    <>
      <div className="w-full h-15 flex justify-center items-center">
        <Spinner className="w-15! h-15!" />
      </div>
      <div className="fixed bottom-10 right-10">
        <TimeoutBackButton />
      </div>
    </>
  );
}
