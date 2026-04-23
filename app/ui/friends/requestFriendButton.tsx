"use client";

import React, { useActionState } from "react";
import SubmitButton from "../submitButton";
import { usePathname, useSearchParams } from "next/navigation";
import { FriendshipState, requestFriendAction, RequestFriendActions } from "@/app/lib/actions/actions.friendship";

export default function RequestFriendButton({ className, friendshipId, action, children }: { className?: string; action: RequestFriendActions; friendshipId: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const friendRequestActionWithArg = requestFriendAction.bind(null, action);
  const [state, formAction, isPending] = useActionState<FriendshipState, FormData>(friendRequestActionWithArg, {});

  return (
    <form className="w-full" action={formAction}>
      <input type="hidden" name="friendshipId" value={friendshipId} />
      <input type="hidden" name="currentPath" value={pathname} />
      <input type="hidden" name="searchParams" value={searchParams.toString()} />
      <SubmitButton disabled={isPending} className={`${className} h-7`}>
        {children}
      </SubmitButton>
    </form>
  );
}
