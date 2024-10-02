"use server";

import logger from "@/lib/logger";
import prisma from "@/prisma";
import type { User } from "@/prisma/generated/client";

export async function getUserByUsername(
  username: string,
): Promise<User | null> {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        deletedAt: null,
        username,
      },
    });

    return user;
  } catch (err) {
    logger.error({
      error: err,
      username,
    });
  }

  return null;
}
