"use server";

import { authOptions } from "@/lib/auth/auth-options";
import logger from "@/lib/logger";
import prisma from "@/prisma";
import type { Note } from "@/prisma/generated/client";
import { getServerSession } from "next-auth";

export async function getNoteByUuid(uuid: string): Promise<Note | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("unauthorized");
    }

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
