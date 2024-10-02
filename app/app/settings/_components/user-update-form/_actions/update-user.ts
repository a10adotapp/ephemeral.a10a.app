"use server";

import { authOptions } from "@/lib/auth/auth-options";
import logger from "@/lib/logger";
import { hashPassword } from "@/lib/password/hash-password";
import prisma from "@/prisma";
import type { User } from "@/prisma/generated/client";
import { getServerSession } from "next-auth";

export async function updateUser(data: {
  username: string;
  password?: string;
  name?: string;
  phoneticName?: string;
}): Promise<User> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("unauthorized");
    }

    const userWithUsername = await prisma.user.findFirst({
      where: {
        deletedAt: null,
        id: {
          not: session.user.id,
        },
        username: data.username,
      },
    });

    if (userWithUsername) {
      throw new Error("user exists with the username");
    }

    const user = await prisma.user.update({
      where: {
        deletedAt: null,
        id: session.user.id,
      },
      data: {
        username: data.username,
        ...(data.password
          ? {
              password: await hashPassword(data.password),
            }
          : {}),
        name: data.name || null,
        phoneticName: data.phoneticName || null,
      },
    });

    return user;
  } catch (err) {
    logger.error({
      error: err,
      data,
    });

    throw err;
  }
}
