"use client";

import { MembersActions } from "@/app/lib/types/types.groups";
import { useMembersContext } from "./membersProvider";

export default function DispatchMemberButton({ type, children, className }: { type: MembersActions; children: React.ReactNode; className: string }) {
  const membersContex = useMembersContext();

  const handleClick = () => {
    membersContex.dispatch(type);
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
