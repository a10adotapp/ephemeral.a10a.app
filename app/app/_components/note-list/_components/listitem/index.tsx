"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { Note } from "@/prisma/generated/client";
import { format } from "@formkit/tempo";
import Image from "next/image";
import Link from "next/link";

export function Listitem({
  note,
}: {
  note: Note;
}) {
  return (
    <Link href={`/notes/${note.uuid}`}>
      <Card className="overflow-hidden">
        {note.imageFilename ? (
          <Image
            width={1200}
            height={630}
            src={`/assets/upload/notes/${note.imageFilename}`}
            alt="share"
          />
        ) : null}

        <CardContent className="px-4 pb-4">
          <div className="font-bold whitespace-nowrap overflow-hidden text-ellipsis">
            {(note.summary || note.body).split("\n").at(0)?.trim()}
          </div>

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
        </CardContent>
      </Card>
    </Link>
  );
}
