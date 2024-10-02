"use client";

import { useFontDataContext } from "@/app/_components/font-data-privider";
import { FormSubmitButton } from "@/components/form-submit-button";
import { Card, CardContent } from "@/components/ui/card";
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
import invert from "invert-color";
import {} from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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

  const { font } = useFontDataContext();

  const [isBusy, setIsBusy] = useState(false);

  const [color, setColor] = useState("#000000");

  const [image, setImage] = useState<string | null>(null);

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
    const updateCanvas = async (value?: {
      body?: string;
      summary?: string;
    }) => {
      const ctx = canvasRef.current?.getContext("2d") || null;

      if (ctx) {
        ctx.reset();
        ctx.clearRect(0, 0, 1200, 630);

        const text = value?.summary || value?.body || "";

        ctx.beginPath();
        ctx.fillStyle = "#ffffff";
        ctx.rect(0, 0, 1200, 630);
        ctx.fill();

        if (image) {
          await new Promise<void>((resolve) => {
            const img = new Image();

            img.onload = () => {
              let sx = 0;
              let sy = 0;
              let sw = img.width;
              let sh = img.height;

              if (img.width / img.height > 1200 / 630) {
                sw = (img.height * 1200) / 630;
                sx = img.width / 2 - sw / 2;
              } else {
                sh = (img.width * 630) / 1200;
                sy = img.height / 2 - sh / 2;
              }

              ctx.beginPath();
              ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 1200, 630);

              resolve();
            };

            img.src = image;
          });
        }

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 20;
        ctx.rect(10, 10, 1180, 610);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 20;
        ctx.roundRect(10, 10, 1180, 610, 20);
        ctx.stroke();

        const rows = text.split("\n");

        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
          const row = rows[rowIndex];
          const y = 315 - (80 * rows.length) / 2 + 60 + 80 * rowIndex;

          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.textAlign = "center";
          ctx.font = `bold 80px ${font?.style.fontFamily}`;
          ctx.shadowColor = invert(color);
          ctx.shadowBlur = 20;
          ctx.fillText(row, 600, y, 1160);
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
  }, [font?.style.fontFamily, color, image, form.watch]);

  const colorFieldChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setColor(event.currentTarget.value);
    },
    [],
  );

  const fileFieldChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.item(0);

      if (file) {
        const fileReader = new FileReader();

        fileReader.onload = () => {
          const parsedImage = z.string().min(1).safeParse(fileReader.result);

          if (parsedImage.success) {
            setImage(parsedImage.data);
          }
        };

        fileReader.readAsDataURL(file);
      } else {
        setImage(null);
      }
    },
    [],
  );

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

          <Card>
            <canvas
              ref={canvasRef}
              width={1200}
              height={630}
              className="w-full aspect-[1200/630] mt-2"
            />

            <CardContent className="p-2">
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={color}
                  onChange={colorFieldChange}
                  className="flex-1"
                />

                <label
                  className="flex-1 h-10 px-3 py-2 border rounded-md text-sm text-center"
                  htmlFor="file-field">
                  <Input
                    id="file-field"
                    type="file"
                    accept="image/*"
                    onChange={fileFieldChange}
                    className="hidden"
                  />
                  背景画像
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        <hr />

        <FormSubmitButton isBusy={isBusy} />
      </form>
    </Form>
  );
}
