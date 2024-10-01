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
import { type SignInResponse, signIn } from "next-auth/react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { SignInAsGuestButton } from "./_components/sign-in-as-guest-button";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FieldInputs = z.input<typeof schema>;
type FieldOutputs = z.output<typeof schema>;

export function SignInForm({
  onSignedIn,
}: {
  onSignedIn?: () => void;
}) {
  const [isBusy, setIsBusy] = useState(false);

  const form = useForm<FieldInputs, unknown, FieldOutputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submit = useCallback(
    async (values: FieldOutputs) => {
      try {
        setIsBusy(true);

        const result = await toast.promise(
          signIn("credentials", {
            ...values,
            redirect: false,
          }),
          {
            loading: "認証情報を確認しています...",
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
    },
    [onSignedIn],
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="username"
                  {...field}
                />
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
              <FormLabel>パスワード</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <hr />

        <FormSubmitButton
          label="サインイン"
          isBusy={isBusy}
        />

        <SignInAsGuestButton onSignedIn={onSignedIn} />
      </form>
    </Form>
  );
}
