"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

export function SignOutButton() {
  const router = useRouter();

  const [isBusy, setIsBusy] = useState(false);

  const click = useCallback(async () => {
    try {
      setIsBusy(true);

      await toast.promise(
        signOut({
          redirect: false,
        }),
        {
          loading: "サインアウトしています...",
          error: (err: unknown) => `${err}`,
          success: () => {
            return "サインアウトに成功しました";
          },
        },
      );

      router.push("/sign-in");

      router.refresh();
    } catch {
      toast.error("サインアウトに失敗しました");
    } finally {
      setIsBusy(false);
    }
  }, [router]);

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={click}
      disabled={isBusy}>
      サインアウト
    </Button>
  );
}
