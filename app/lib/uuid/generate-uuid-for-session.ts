"use server";

import prisma from "@/prisma";

export async function generateUuidForSession(): Promise<string> {
  while (true) {
    const uuid = crypto.randomUUID();

    const session = await prisma.session.findFirst({
      where: {
        uuid,
      },
    });

    if (!session) {
      return uuid;
    }
  }
}
