"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex flex-col gap-4">
      <Alert
        variant="destructive"
        className="bg-white">
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>エラー</AlertTitle>
        <AlertDescription>
          <div className="flex flex-col gap-4">
            <Image
              src="/assets/lesser-panda.2.png"
              alt="Sorry"
              width={676}
              height={600}
              className="p-20"
            />

            <p>ご指定のメモは削除されたか、または存在しないようです。</p>

            <div>
              <Button
                asChild
                variant="outline"
                className="text-neutral-950">
                <Link href="/">トップページへ戻る</Link>
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
