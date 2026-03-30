"use client";

import { CreateCheckParticipantsCardsType, ParticipantsActions, ParticipantsActionsTypes } from "@/app/lib/types/types.checks";
import { createContext, ReactNode, useContext, useEffect, useReducer, useState } from "react";
import { participantsReducer } from "./participants-reducer";
import { sumParticipantsAmount } from "./utils";

export type ParticipantState = { lastDispatch: ParticipantsActionsTypes; participanstList: CreateCheckParticipantsCardsType[]; creator: CreateCheckParticipantsCardsType; total: number };

interface ParticipatsContextValue {
  state: ParticipantState;
  dispatch: React.Dispatch<ParticipantsActions>;
  remindAmount: number;
  //   ids: string[];
}

const ParticipantsContext = createContext<ParticipatsContextValue | undefined>(undefined);

interface ParticipantsProviderProp {
  children: ReactNode;
  initialState: ParticipantState;
}

export const ParticipantsProvider: React.FC<ParticipantsProviderProp> = ({ children, initialState }) => {
  const [state, dispatch] = useReducer(participantsReducer, initialState);
  const [remindAmount, setRemindAmount] = useState<number>(0);

  useEffect(() => {
    const participantsValue = sumParticipantsAmount(state.participanstList);

    setRemindAmount(parseFloat((state.total - (participantsValue + state.creator.amount)).toFixed()));

    //  const creator = state.participanstList.find((member) => member.isCreator);
    //  if (creator) {
    //    setIsCreatorParticipate(creator?.participating);
    //  } else {
    //    setIsCreatorParticipate(false);
    //  }
  }, [state.creator, state.participanstList, state.total]);

  return <ParticipantsContext.Provider value={{ state, remindAmount, dispatch }}>{children}</ParticipantsContext.Provider>;
};

export const useParticipantsContext = (): ParticipatsContextValue => {
  const context = useContext(ParticipantsContext);
  if (context === undefined) {
    throw new Error("useParticipantsContext must be used within an ParticipantsProvider");
  }
  return context;
};
