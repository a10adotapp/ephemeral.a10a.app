"use server";

import logger from "@/lib/logger";
import prisma from "@/prisma";
import type { User } from "@/prisma/generated/client";

export async function getUserByUuid(uuid: string): Promise<User | null> {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        deletedAt: null,
        uuid,
      },
    });

    return user;
  } catch (err) {
    logger.error({
      error: err,
      uuid,
    });
  }

  return null;
}
