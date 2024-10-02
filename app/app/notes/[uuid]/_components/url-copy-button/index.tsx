"use client";
import { Button } from "@/components/ui/button";
import { getAppUrl } from "@/lib/env/get-app-url";
import type { Note } from "@/prisma/generated/client";
import { Copy } from "lucide-react";
import { useCallback } from "react";
import toast from "react-hot-toast";

export function UrlCopyButton({
  note,
}: {
  note: Note;
}) {
  const click = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(
        `${await getAppUrl()}/notes/${note.uuid}`,
      );

      toast.success("URLをコピーしました");
    } catch (err) {
      toast.error("URLをコピーできませんでした");

      alert(JSON.stringify(err));
    }
  }, [note.uuid]);

  return (
    <Button
      variant="outline"
      className="bg-white"
      onClick={click}>
      <div className="flex items-center gap-1">
        <Copy size={16} />

        <span>シェアURLをコピー</span>
      </div>
    </Button>
  );
}
