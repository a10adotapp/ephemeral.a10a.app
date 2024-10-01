"use server";

import prisma from "@/prisma";

export async function generateUuidForNote(): Promise<string> {
  while (true) {
    const uuid = crypto.randomUUID();

    const note = await prisma.note.findFirst({
      where: {
        uuid,
      },
    });

    if (!note) {
      return uuid;
    }
  }
}
