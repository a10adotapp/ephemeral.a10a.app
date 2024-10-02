import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserUpdateForm } from "./_components/user-update-form";

export default async function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ユーザー情報</CardTitle>
      </CardHeader>

      <CardContent>
        <UserUpdateForm />
      </CardContent>
    </Card>
  );
}
