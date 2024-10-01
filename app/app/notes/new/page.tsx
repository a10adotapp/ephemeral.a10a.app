import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateForm } from "./_components/create-form";

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>メモを新規作成</CardTitle>
      </CardHeader>

      <CardContent>
        <CreateForm />
      </CardContent>
    </Card>
  );
}
