"use server";
import {} from "node:fs";
import { authOptions } from "@/lib/auth/auth-options";
import { getAppUrlInternal } from "@/lib/env/get-app-url-internal";
import logger from "@/lib/logger";
import { generateUuidForNote } from "@/lib/uuid/generate-uuid-for-note";
import prisma from "@/prisma";
import type { Note } from "@/prisma/generated/client";
import { getServerSession } from "next-auth";
import { z } from "zod";

const postImageResponseSchema = z.object({
  imageFilename: z.string().min(1),
});

export async function createNote(data: {
  body: string;
  summary?: string;
  expiredAt?: Date;
  image?: string;
}): Promise<Note> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("unauthorized");
    }

    let note = await prisma.note.create({
      data: {
        userId: session.user.id,
        uuid: await generateUuidForNote(),
        ...{
          ...data,
          image: undefined,
        },
      },
    });

    if (data.image) {
      const imageBufferStr = data.image.split(",").at(1);

      if (imageBufferStr) {
        const response = await fetch(
          `${await getAppUrlInternal()}/api/notes/${note.uuid}/image`,
          {
            method: "POST",
            headers: {
              "x-user-uuid": session.user.uuid,
            },
            body: JSON.stringify({
              data: imageBufferStr,
            }),
          },
        );

        if (response.ok) {
          const parsedResponseData = postImageResponseSchema.parse(
            await response.json(),
          );

          note = await prisma.note.update({
            where: {
              deletedAt: null,
              id: note.id,
            },
            data: {
              imageFilename: parsedResponseData.imageFilename,
            },
          });
        }
      }
    }

    return note;
  } catch (err) {
    logger.error({
      error: err,
      data,
    });

    throw err;
  }
}
