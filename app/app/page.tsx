import { NewButton } from "@/components/new-button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NoteList } from "./_components/note-list";

export default async function Page() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-base">
            Ephemeralは
            <br />
            メモを作成・共有できる
            <br />
            サービスです。
          </CardTitle>

          <CardDescription className="text-center text-base">
            今日だけ共有できる、
            <br />
            明日まで共有したい、
            <br />
            今月いっぱい共有したい。
            <br />
            そんなことができます。
          </CardDescription>
        </CardHeader>
      </Card>

      <NewButton href="/notes/new">新しくメモを作成する</NewButton>

      <NoteList />
    </div>
  );
}
