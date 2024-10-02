"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { SignOutButton } from "./_components/sign-out-button";

export function UserDisplay() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <Card>
      <div className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="p-1">
              <User size={16} />
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex items-baseline gap-1">
                <ruby className="font-bold">
                  {session.user.name || "ゲスト"}
                  {session.user.phoneticName ? (
                    <rt>{session.user.phoneticName}</rt>
                  ) : null}
                </ruby>

                <span className="text-gray-600">さん</span>
              </div>

              {session.user.username ? (
                <div className="text-gray-600 text-sm">{`@${session.user.username}`}</div>
              ) : null}
            </div>
          </div>

          <Button
            asChild
            variant="outline">
            <Link href="/settings">設定</Link>
          </Button>

          <SignOutButton />
        </div>
      </div>
    </Card>
  );
}
