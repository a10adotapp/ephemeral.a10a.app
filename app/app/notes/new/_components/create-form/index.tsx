"use client";

import { FormSubmitButton } from "@/components/form-submit-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {} from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { createNote } from "./_actions/create-note";

const schema = z.object({
  body: z.string().min(1),
  summary: z.string().transform((v) => v || undefined),
  expiredAt: z
    .string()
    .transform((v) => v || undefined)
    .optional()
    .pipe(z.coerce.date().optional()),
});

type FieldInputs = z.input<typeof schema>;
type FieldOutputs = z.output<typeof schema>;

export function CreateForm() {
  const router = useRouter();

  const [isBusy, setIsBusy] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const form = useForm<FieldInputs, unknown, FieldOutputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      body: "",
      summary: "",
    },
  });

  const submit = useCallback(
    async (values: FieldOutputs) => {
      try {
        setIsBusy(true);

        const serializedImage = canvasRef.current?.toDataURL("image/jpeg");

        const result = await toast.promise(
          createNote({
            ...values,
            image: serializedImage,
          }),
          {
            loading: "メモを保存しています...",
            error: () => "メモの保存に失敗しました",
            success: () => "メモの保存に成功しました",
          },
        );

        router.push("/");

        router.refresh();
      } catch (err) {
        console.log({ err });
        toast.error("メモの保存に失敗しました");
      } finally {
        setIsBusy(false);
      }
    },
    [router],
  );

  useEffect(() => {
    const updateCanvas = (value?: {
      body?: string;
      summary?: string;
    }) => {
      const ctx = canvasRef.current?.getContext("2d") || null;

      if (ctx) {
        ctx.clearRect(0, 0, 1200, 630);

        const text = value?.summary || value?.body || "";

        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.rect(0, 0, 1200, 630);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "#ffffff";
        ctx.roundRect(20, 20, 1160, 590, 20);
        ctx.fill();

        const rows = text.split("\n");

        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
          const row = rows[rowIndex];

          ctx.beginPath();
          ctx.fillStyle = "#000000";
          ctx.textAlign = "center";
          ctx.font = "bold 80px 'M PLUS 1 Code'";
          ctx.fillText(row, 600, 100 + 100 * rowIndex, 1200);
        }
      }
    };

    const subscription = form.watch((value, { name, type }) => {
      if (type === "change") {
        updateCanvas(value);
      }
    });

    updateCanvas();

    return () => {
      subscription.unsubscribe();
    };
  }, [form.watch]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="expiredAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>公開期限</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メモ内容</FormLabel>
              <FormControl>
                <Textarea
                  className="h-[25vh]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>要約</FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="">
          <div className="text-sm font-medium leading-none">シェア画像</div>

          <canvas
            ref={canvasRef}
            width={1200}
            height={630}
            className="w-full aspect-[1200/630] mt-2"
          />
        </div>

        <hr />

        <FormSubmitButton isBusy={isBusy} />
      </form>
    </Form>
  );
}
