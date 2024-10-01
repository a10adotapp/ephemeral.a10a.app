"use server";

import logger from "@/lib/logger";
import prisma from "@/prisma";
import type { User } from "@/prisma/generated/client";

export async function getUser(id: number): Promise<User | null> {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        deletedAt: null,
        id,
      },
    });

    return user;
  } catch (err) {
    logger.error({
      error: err,
      id,
    });
  }

  return null;
}
