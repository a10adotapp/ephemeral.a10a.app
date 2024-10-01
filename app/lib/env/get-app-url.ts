"use server";

import { z } from "zod";

export async function getAppUrl(): Promise<string> {
  const parsedEnv = z
    .object({
      NEXT_PUBLIC_APP_URL: z.string().url(),
    })
    .parse(process.env);

  return parsedEnv.NEXT_PUBLIC_APP_URL;
}
