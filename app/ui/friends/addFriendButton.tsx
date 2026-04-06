"use client";

import React, { Children, useActionState } from "react";
import SubmitButton from "../submitButton";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FriendshipState, sendFriendRequestByUsers } from "@/app/lib/actions/actions.friendship";

export default function AddFriendButton({ friendId, children }: { friendId: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState<FriendshipState, FormData>(sendFriendRequestByUsers, {});

  return (
<form action={formAction}>
  <input type="hidden" name="targetUserId" value={friendId} />
  <input type="hidden" name="currentPath" value={pathname} />
  <input type="hidden" name="searchParams" value={searchParams.toString()} />
  <SubmitButton disabled={isPending} className="bg-success text-text-primary hover:bg-success/70 shadow-sm transition-all duration-200">
    {children}
  </SubmitButton>
</form>
  );
}
