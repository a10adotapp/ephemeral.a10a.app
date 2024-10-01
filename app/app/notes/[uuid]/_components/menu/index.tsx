"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Note } from "@/prisma/generated/client";
import { Settings2 } from "lucide-react";
import { DeleteButton } from "./_components/delete-button";

export function Menu({
  note,
}: {
  note: Note;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="bg-white">
          <div className="flex items-center gap-1">
            <Settings2 size={16} />

            <span>管理メニュー</span>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end">
        <div className="flex flex-col gap-4">
          <DeleteButton note={note} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
