"use server";

import { z } from "zod";

export async function getUploadFileDirname(): Promise<string> {
  const parsedEnv = z
    .object({
      UPLOAD_FILE_DIRNAME: z.string().min(1),
    })
    .parse(process.env);

  return parsedEnv.UPLOAD_FILE_DIRNAME;
}
