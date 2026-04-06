"use client";

import React, { useActionState } from "react";
import SubmitButton from "../submitButton";

import { actionInvite, ActionInviteState } from "@/app/lib/actions/actions.groups";
import Spinner from "../spinner";

export default function ActionInviteButton({
  groupId,
  memberId,
  action,
  children,
  className,
}: {
  className: string;
  action: "decline" | "accept" | "resend" | "delete";
  groupId: string;
  memberId: string;
  children: React.ReactNode;
}) {
  const [state, formAction, isPending] = useActionState<ActionInviteState, FormData>(actionInvite, {});

  return (
    <form action={formAction}>
      <input type="hidden" name="action" value={action} />
      <input type="hidden" name="groupId" value={groupId} />
      <input type="hidden" name="memberId" value={memberId} />
      <SubmitButton disabled={isPending} className={className}>
        {isPending ? <Spinner className="h-4! w-4!" /> : children}
      </SubmitButton>
    </form>
  );
}
