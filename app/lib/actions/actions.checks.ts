"use server";

import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export type CreateCheckState = {
  success?: boolean;
  checkId?: string;
  errors?: {
    title?: string;
    amount?: string;
    myShare?: string;
    particiants?: string;
    remindAmount?: string;
    general?: string;
  };
};

//
export async function createCheckAction(prevState: CreateCheckState, formData: FormData): Promise<CreateCheckState> {
  console.log("formData", formData);

  return prevState;
}
