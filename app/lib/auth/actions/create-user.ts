"use server";

import logger from "@/lib/logger";
import { generateUuidForUser } from "@/lib/uuid/generate-uuid-for-user";
import prisma from "@/prisma";
import type { User } from "@/prisma/generated/client";

export async function createUser(): Promise<User> {
  try {
    const user = await prisma.user.create({
      data: {
        uuid: await generateUuidForUser(),
      },
    });

    return user;
  } catch (err) {
    logger.error({
      error: err,
    });

    throw err;
  }
}
