"use server";

import logger from "@/lib/logger";
import prisma from "@/prisma";
import type { Session } from "@/prisma/generated/client";

export async function getSessionByUuid(uuid: string): Promise<Session | null> {
  try {
    const session = await prisma.session.findFirstOrThrow({
      where: {
        deletedAt: null,
        uuid,
      },
    });

    return session;
  } catch (err) {
    logger.error({
      error: err,
      uuid,
    });
  }

  return null;
}
