"use server";

import { join } from "node:path";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { authOptions } from "@/lib/auth/auth-options";
import { getAppUrl } from "@/lib/env/get-app-url";
import { format, isAfter } from "@formkit/tempo";
import { AlertCircle } from "lucide-react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import Markdown from "react-markdown";
import { z } from "zod";
import { getNoteByUuid } from "./_actions/get-note-by-uuid";
import { Menu } from "./_components/menu";
import { UrlCopyButton } from "./_components/url-copy-button";

const paramsSchema = z.object({
  uuid: z.string().uuid(),
  rev: z.coerce.number().min(1).optional(),
});

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: {
    [key in string]: string[] | string | null;
  };
  searchParams: {
    [key in string]: string[] | string | null;
  };
}): Promise<Metadata> {
  const parsedParams = paramsSchema.parse({
    ...params,
    ...searchParams,
  });

  const note = await getNoteByUuid(parsedParams.uuid);

  if (!note) {
    return {};
  }

  return {
    metadataBase: new URL(await getAppUrl()),
    title: "Ephemeral - メモ作成サービス -",
    description: (note.summary || note.body || "").split("\n").at(0),
    openGraph: {
      images: [
        ...(note.imageFilename
          ? [
              {
                url: join(await getAppUrl(), "api/notes/", note.uuid, "image"),
                width: 1200,
                height: 630,
              },
            ]
          : []),
      ],
    },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: {
    [key in string]: string[] | string | null;
  };
  searchParams: {
    [key in string]: string[] | string | null;
  };
}) {
  const parsedParams = paramsSchema.parse({
    ...params,
    ...searchParams,
  });

  const session = await getServerSession(authOptions);

  const note = await getNoteByUuid(parsedParams.uuid);

  if (!note) {
    return redirect(
      `/?${new URLSearchParams({
        error: "メモが存在しません",
      }).toString()}`,
    );
  }

  const hasExpired = ((): boolean => {
    if (note.expiredAt === null) {
      return false;
    }

    return isAfter(new Date(), note.expiredAt);
  })();

  return (
    <div className="flex flex-col gap-4">
      {session?.user.id === note.userId ? (
        <div className="flex flex-col items-end gap-2">
          <Menu note={note} />

          <UrlCopyButton note={note} />
        </div>
      ) : null}

      <Card className="overflow-hidden">
        {hasExpired ? (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>有効期限切れ</AlertTitle>
            </Alert>
          </div>
        ) : (
          <>
            {note.imageFilename ? (
              <Image
                width={1200}
                height={630}
                src={`/api/notes/${note.uuid}/image`}
                alt="share"
                priority={true}
              />
            ) : null}
          </>
        )}
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col items-end gap-2">
            <div className="px-2 bg-green-200 rounded-full text-sm text-gray-600">
              作成：
              {format({
                date: note.updatedAt,
                format: "YYYY年MM月DD日 hh時mm分",
                tz: "Asia/Tokyo",
              })}
            </div>

            <div className="px-2 bg-orange-200 rounded-full text-sm text-gray-600">
              公開期限：
              {note.expiredAt
                ? format({
                    date: note.expiredAt,
                    format: "YYYY年MM月DD日 hh時mm分",
                    tz: "Asia/Tokyo",
                  })
                : "-"}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {hasExpired ? null : (
            <Markdown>
              {(note.summary || note.body).replace(/\n/g, "  \n")}
            </Markdown>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
