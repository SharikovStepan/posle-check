"use client";

import { MembersActions, MembersArray } from "@/app/lib/types/types.groups";
import React, { createContext, useReducer, useContext, ReactNode, useEffect, useState } from "react";
import { membersInitialState, membersReducer } from "./members-reducer";

interface MembersContextValue {
  state: MembersArray;
  dispatch: React.Dispatch<MembersActions>;
  ids: string[];
}

const MembersContext = createContext<MembersContextValue | undefined>(undefined);

interface MemberProviderProp {
  children: ReactNode;
}

export const MembersProvider: React.FC<MemberProviderProp> = ({ children }) => {
  const [state, dispatch] = useReducer(membersReducer, membersInitialState);
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(state.map((member) => member.id));
  }, [state]);

  return <MembersContext.Provider value={{ state, ids, dispatch }}>{children}</MembersContext.Provider>;
};

export const useMembersContext = (): MembersContextValue => {
  const context = useContext(MembersContext);
  if (context === undefined) {
    throw new Error("useMembersContext must be used within an MembersProvider");
  }
  return context;
};
