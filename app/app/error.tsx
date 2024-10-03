"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Image from "next/image";

export default function ErrorPage({
  reset,
}: {
  reset: () => void;
}) {
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
              src="/assets/lesser-panda.1.png"
              alt="Sorry"
              width={900}
              height={640}
              className="ms-[-2.75rem] w-[calc(100%+3.75rem)] max-w-none"
            />

            <p>エラーが発生しました。</p>

            <div>
              <Button
                variant="outline"
                className="text-neutral-950"
                onClick={() => reset()}>
                ページを再読み込みする
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
