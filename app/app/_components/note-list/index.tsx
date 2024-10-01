"use server";

import {} from "@/components/ui/card";
import { listNote } from "./_actions/list-note";
import { Listitem } from "./_components/listitem";

export async function NoteList() {
  const notes = await listNote();

  return (
    <div className="flex flex-col gap-2">
      <h2>あなたのメモ</h2>

      {notes?.map((note) => {
        return (
          <Listitem
            key={`note-list-listitem-${note.id}`}
            note={note}
          />
        );
      })}
    </div>
  );
}
