"use server";

import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { authOptions } from "@/lib/auth/auth-options";
import { getUploadFileDirname } from "@/lib/env/get-upload-file-dirname";
import logger from "@/lib/logger";
import { generateUuidForNote } from "@/lib/uuid/generate-uuid-for-note";
import prisma from "@/prisma";
import type { Note } from "@/prisma/generated/client";
import { getServerSession } from "next-auth";

export async function createNote(data: {
  body: string;
  summary?: string;
  expiredAt?: Date;
  image?: string;
}): Promise<Note> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("unauthorized");
    }

    let imageFilename: string | null = null;

    if (data.image) {
      const imageBufferStr = data.image.split(",").at(1);

      if (imageBufferStr) {
        const imageBuffer = Buffer.from(imageBufferStr, "base64");

        imageFilename = `${createHash("md5").update(imageBuffer).digest("hex")}.jpg`;

        const dirName = join(await getUploadFileDirname(), "notes");

        mkdirSync(dirName, { recursive: true });

        writeFileSync(join(dirName, imageFilename), imageBuffer);
      }
    }

    const note = await prisma.note.create({
      data: {
        userId: session.user.id,
        uuid: await generateUuidForNote(),
        imageFilename,
        ...{
          ...data,
          image: undefined,
        },
      },
    });

    return note;
  } catch (err) {
    logger.error({
      error: err,
      data,
    });

    throw err;
  }
}
