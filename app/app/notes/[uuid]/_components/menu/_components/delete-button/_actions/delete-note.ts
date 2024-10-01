"use server";

import { authOptions } from "@/lib/auth/auth-options";
import logger from "@/lib/logger";
import prisma from "@/prisma";
import type { Note } from "@/prisma/generated/client";
import { getServerSession } from "next-auth";

export async function deleteNote(note: Note): Promise<void> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("unauthorized");
    }

    await prisma.note.update({
      where: {
        deletedAt: null,
        id: note.id,
        userId: session.user.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  } catch (err) {
    logger.error({
      error: err,
      note: note.id,
    });

    throw err;
  }
}
