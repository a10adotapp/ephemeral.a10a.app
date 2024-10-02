import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getUploadFileDirname } from "@/lib/env/get-upload-file-dirname";
import logger from "@/lib/logger";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getNoteByUuid } from "./_actions/get-note-by-uuid";
import { getUserByUuid } from "./_actions/get-user-by-uuid";

const getSchema = z.object({
  uuid: z.string().uuid(),
});

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      [key in string]: string[] | string | null;
    };
  },
) {
  try {
    const parsedSchema = getSchema.parse(params);

    const note = await getNoteByUuid(parsedSchema.uuid);

    if (!note) {
      throw new Error("note not found");
    }

    if (!note.imageFilename) {
      throw new Error("note image does not exist");
    }

    const dirName = join(await getUploadFileDirname(), "assets/upload/notes");

    const imageData = await readFileSync(join(dirName, note.imageFilename));

    return new NextResponse(imageData, {
      headers: {
        "content-type": "image/jpeg",
      },
    });
  } catch (err) {
    logger.error({
      error: err,
      params,
    });
  }

  return new NextResponse("internal server error", {
    status: 500,
  });
}

const postRequestSchema = z.object({
  data: z.string().min(1),
});

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      [key in string]: string[] | string | null;
    };
  },
) {
  try {
    const userUuid = request.headers.get("x-user-uuid");

    if (!userUuid) {
      throw new Error("unauthorized");
    }

    const user = await getUserByUuid(userUuid);

    if (!user) {
      throw new Error("user not found");
    }

    const parsedSchema = getSchema.parse(params);

    const note = await getNoteByUuid(parsedSchema.uuid);

    if (!note) {
      throw new Error("note not found");
    }

    const parsedRequest = postRequestSchema.parse(await request.json());

    const imageBuffer = Buffer.from(parsedRequest.data, "base64");

    const imageFilename = `${createHash("md5").update(imageBuffer).digest("hex")}.jpg`;

    const dirName = join(await getUploadFileDirname(), "assets/upload/notes");

    mkdirSync(dirName, { recursive: true });

    writeFileSync(join(dirName, imageFilename), imageBuffer);

    return NextResponse.json({
      imageFilename,
    });
  } catch (err) {
    logger.error({
      error: err,
      params,
    });
  }

  return new NextResponse("internal server error", {
    status: 500,
  });
}
