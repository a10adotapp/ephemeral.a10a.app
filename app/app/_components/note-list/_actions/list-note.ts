"use server";

import { authOptions } from "@/lib/auth/auth-options";
import logger from "@/lib/logger";
import prisma from "@/prisma";
import type { Note } from "@/prisma/generated/client";
import { getServerSession } from "next-auth";

export async function listNote(): Promise<Note[] | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("unauthorized");
    }

    const notes = await prisma.note.findMany({
      where: {
        deletedAt: null,
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notes;
  } catch (err) {
    logger.error({
      error: err,
    });
  }

  return null;
}
