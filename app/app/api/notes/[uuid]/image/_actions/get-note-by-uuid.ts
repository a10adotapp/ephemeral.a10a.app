"use server";

import logger from "@/lib/logger";
import prisma from "@/prisma";
import type { Note } from "@/prisma/generated/client";

export async function getNoteByUuid(uuid: string): Promise<Note | null> {
  try {
    const note = await prisma.note.findFirstOrThrow({
      where: {
        deletedAt: null,
        uuid,
      },
    });

    return note;
  } catch (err) {
    logger.error({
      error: err,
    });
  }

  return null;
}
