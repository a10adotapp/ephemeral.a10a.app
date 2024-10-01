"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { z } from "zod";
import { SignInForm } from "./_components/sign-in-form";

const paramsSchema = z.object({
  redirect: z.string().optional(),
});

export default function Page({
  searchParams,
}: {
  searchParams: {
    [key in string]: string[] | string | null;
  };
}) {
  const parsedParams = paramsSchema.parse({
    ...searchParams,
  });

  const { data: session } = useSession();

  const router = useRouter();

  const signedIn = useCallback(() => {
    router.push(parsedParams.redirect || "/");

    router.refresh();
  }, [parsedParams.redirect, router]);

  useEffect(() => {
    if (session) {
      router.push(parsedParams.redirect || "/");

      router.refresh();
    }
  }, [parsedParams.redirect, session, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>サインイン</CardTitle>
      </CardHeader>

      <CardContent>
        <SignInForm onSignedIn={signedIn} />
      </CardContent>
    </Card>
  );
}
