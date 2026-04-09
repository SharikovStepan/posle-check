import { useActionState } from "react";
import SubmitButton from "../submitButton";
import Spinner from "../spinner";
import { changeSelfCheckParticipating, SelfCheckParticipatingType } from "@/app/lib/actions/actions.checks";

export default function ToggleParticipatingButton({
  checkId,
  memberId,
  participating,
  children,
  className,
}: {
  className: string;
  participating: "true" | "false";
  checkId: string;
  memberId: string;
  children: React.ReactNode;
}) {
  const [state, formAction, isPending] = useActionState<SelfCheckParticipatingType, FormData>(changeSelfCheckParticipating, {});

  return (
    <form action={formAction}>
      <input type="hidden" name="participating" value={participating} />
      <input type="hidden" name="checkId" value={checkId} />
      <input type="hidden" name="memberId" value={memberId} />
      <SubmitButton disabled={isPending} className={className}>
        {isPending ? <Spinner className="h-4! w-4!" /> : children}
      </SubmitButton>
    </form>
  );
}
