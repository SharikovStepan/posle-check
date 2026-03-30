"use client";

import { CreateCheckParticipantsCardsType, ParticipantsActions, ParticipantsActionsTypes } from "@/app/lib/types/types.checks";
import { createContext, ReactNode, useContext, useEffect, useReducer, useState } from "react";
import { participantsReducer } from "./participants-reducer";

export type ParticipantState = { lastDispatch: ParticipantsActionsTypes; participanstList: CreateCheckParticipantsCardsType[];creator:CreateCheckParticipantsCardsType;total:number };

interface ParticipatsContextValue {
  state: ParticipantState;
  dispatch: React.Dispatch<ParticipantsActions>;
  //   ids: string[];
}

const ParticipantsContext = createContext<ParticipatsContextValue | undefined>(undefined);

interface ParticipantsProviderProp {
  children: ReactNode;
  initialState: ParticipantState;
}

export const ParticipantsProvider: React.FC<ParticipantsProviderProp> = ({ children, initialState }) => {
  const [state, dispatch] = useReducer(participantsReducer, initialState);
//   const [isCreatorParticipate, setIsCreatorParticipate] = useState<boolean>(true);

  useEffect(() => {
   //  const creator = state.participanstList.find((member) => member.isCreator);
   //  if (creator) {
   //    setIsCreatorParticipate(creator?.participating);
   //  } else {
   //    setIsCreatorParticipate(false);
   //  }
  }, []);

  return <ParticipantsContext.Provider value={{ state, dispatch }}>{children}</ParticipantsContext.Provider>;
};

export const useParticipantsContext = (): ParticipatsContextValue => {
  const context = useContext(ParticipantsContext);
  if (context === undefined) {
    throw new Error("useParticipantsContext must be used within an ParticipantsProvider");
  }
  return context;
};
