"use server";

import logger from "@/lib/logger";
import { getServerIpAddress } from "@/lib/server-ip-address/get-server-ip-address";
import { getServerUserAgent } from "@/lib/server-user-agent/get-server-user-agent";
import { generateUuidForSession } from "@/lib/uuid/generate-uuid-for-session";
import prisma from "@/prisma";
import type { Session, User } from "@/prisma/generated/client";

export async function createSession(user: User): Promise<Session> {
  try {
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        uuid: await generateUuidForSession(),
        ipAddress: getServerIpAddress() || "unknown",
        userAgent: getServerUserAgent() || "unknown",
      },
    });

    return session;
  } catch (err) {
    logger.error({
      error: err,
      user,
    });

    throw err;
  }
}
