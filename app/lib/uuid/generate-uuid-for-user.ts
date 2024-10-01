"use server";

import prisma from "@/prisma";

export async function generateUuidForUser(): Promise<string> {
  while (true) {
    const uuid = crypto.randomUUID();

    const user = await prisma.user.findFirst({
      where: {
        uuid,
      },
    });

    if (!user) {
      return uuid;
    }
  }
}
