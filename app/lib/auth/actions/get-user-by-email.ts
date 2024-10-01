"use server";

import logger from "@/lib/logger";
import prisma from "@/prisma";
import type { User } from "@/prisma/generated/client";

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        deletedAt: null,
        email,
      },
    });

    return user;
  } catch (err) {
    logger.error({
      error: err,
      email,
    });
  }

  return null;
}
