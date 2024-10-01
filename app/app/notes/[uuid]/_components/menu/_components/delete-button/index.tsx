"use client";

import { DeleteButton as BaseDeleteButton } from "@/components/delete-button";
import type { Note } from "@/prisma/generated/client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { deleteNote } from "./_actions/delete-note";

export function DeleteButton({
  note,
}: {
  note: Note;
}) {
  const router = useRouter();

  const [isBusy, setIsBusy] = useState(false);

  const click = useCallback(async () => {
    if (!confirm("本当に削除しますか？")) {
      return;
    }

    try {
      setIsBusy(true);

      await toast.promise(deleteNote(note), {
        loading: "メモを削除しています...",
        error: () => "メモの削除に失敗しました",
        success: () => "メモの削除に成功しました",
      });

      router.push("/");

      router.refresh();
    } catch {
      toast.error("メモの削除に失敗しました");
    } finally {
      setIsBusy(false);
    }
  }, [note, router]);

  return <BaseDeleteButton onClick={click} />;
}
