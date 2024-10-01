import { format } from "node:url";
import { authOptions } from "@/lib/auth/auth-options";
import { getServerPathname } from "@/lib/server-pathname/get-server-pathname";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { M_PLUS_1_Code } from "next/font/google";
import { RedirectType, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { MainHeader } from "./_components/main-header";
import { SessionProvider } from "./_components/session-provider";

import "./globals.css";
import { ErrorToast } from "./_components/error-toast";

export const metadata: Metadata = {
  title: "Ephemeral",
};

const font = M_PLUS_1_Code({
  subsets: [],
});

export default async function Layout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const pathname = await getServerPathname();

  if (pathname !== "/sign-in") {
    if (!session || !session.user.id) {
      return redirect(
        format({
          pathname: "/sign-in",
          query: {
            redirect: pathname,
          },
        }),
        RedirectType.push,
      );
    }
  }

  return (
    <html lang="ja">
      <body className={font.className}>
        <div className="flex justify-center">
          <div className="max-w-md w-full">
            <SessionProvider session={session}>
              <div className="flex flex-col bg-gray-100">
                <div className="flex flex-col h-screen overflow-y-hidden">
                  <div className="w-full bg-white py-2 px-6">
                    <MainHeader />
                  </div>

                  <div className="flex flex-col overflow-x-hidden">
                    <main className="w-full flex-grow p-6">{children}</main>
                  </div>
                </div>
              </div>
            </SessionProvider>
          </div>
        </div>

        <Toaster />

        <ErrorToast />
      </body>
    </html>
  );
}
