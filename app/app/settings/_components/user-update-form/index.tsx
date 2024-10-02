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
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { updateUser } from "./_actions/update-user";

const schema = z.object({
  username: z.string().min(1),
  password: z.string(),
  name: z.string(),
  phoneticName: z.string(),
});

type FieldInputs = z.input<typeof schema>;
type FieldOutputs = z.output<typeof schema>;

export function UserUpdateForm() {
  const { data: session } = useSession();

  const [isBusy, setIsBusy] = useState(false);

  const form = useForm<FieldInputs, unknown, FieldOutputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: session?.user.username || "",
      password: "",
      name: session?.user.name || "",
      phoneticName: session?.user.phoneticName || "",
    },
  });

  const submit = useCallback(async (values: FieldOutputs) => {
    try {
      setIsBusy(true);

      const result = await toast.promise(updateUser(values), {
        loading: "ユーザー情報を保存しています...",
        error: () => "ユーザー情報を保存に失敗しました",
        success: () => "ユーザー情報を保存に成功しました",
      });
    } catch (err) {
      toast.error("ユーザー情報を保存に失敗しました");
    } finally {
      setIsBusy(false);
    }
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ユーザー名（サインイン）</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <div className="px-2">@</div>

                  <Input
                    autoFocus={true}
                    autoComplete="username"
                    placeholder="yamadatarou"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>パスワード（サインイン）</FormLabel>
              <FormControl>
                <Input
                  autoComplete="new-password"
                  placeholder="********"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>名前（表示用）</FormLabel>
              <FormControl>
                <Input
                  autoComplete="nickname"
                  placeholder="山田太郎"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneticName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>名前（表示用よみかた）</FormLabel>
              <FormControl>
                <Input
                  placeholder="やまだたろう"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <hr />

        <FormSubmitButton isBusy={isBusy} />
      </form>
    </Form>
  );
}
