"use server";

import { z } from "zod";

export async function getAppUrlInternal(): Promise<string> {
  const parsedEnv = z
    .object({
      APP_URL_INTERNAL: z.string().url(),
    })
    .parse(process.env);

  return parsedEnv.APP_URL_INTERNAL;
}
