"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { type SignInResponse, signIn } from "next-auth/react";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

export function SignInAsGuestButton({
  onSignedIn,
}: {
  onSignedIn?: () => void;
}) {
  const [isBusy, setIsBusy] = useState<boolean>(false);

  const click = useCallback(async () => {
    try {
      setIsBusy(true);

      const result = await toast.promise(
        signIn("credentials", {
          asGuest: true,
          redirect: false,
        }),
        {
          loading: "アカウントを作成しています...",
          error: (err: unknown) => `${err}`,
          success: (result: SignInResponse | undefined) => {
            if (!result?.ok) {
              throw "サインインに失敗しました";
            }

            return "サインインに成功しました";
          },
        },
      );

      if (result?.ok) {
        onSignedIn?.();
      }
    } catch {
      toast.error("サインインに失敗しました");
    } finally {
      setIsBusy(false);
    }
  }, [onSignedIn]);

  return (
    <Button
      variant="ghost"
      type="button"
      disabled={isBusy}
      onClick={click}>
      <div className="flex justify-center items-center gap-1">
        <Loader
          size={16}
          className={cn(
            ...((isBusy ?? false) ? ["animate-spin"] : ["invisible"]),
          )}
        />

        <span>初めての方はこちら</span>

        <span className="w-[16px]" />
      </div>
    </Button>
  );
}
