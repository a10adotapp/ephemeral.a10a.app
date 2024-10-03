import { authOptions } from "@/lib/auth/auth-options";
import type { Metadata, Viewport } from "next";
import { getServerSession } from "next-auth";
import { M_PLUS_1_Code } from "next/font/google";
import {} from "next/navigation";
import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { ErrorToast } from "./_components/error-toast";
import { MainHeader } from "./_components/main-header";
import { SessionProvider } from "./_components/session-provider";

import "./globals.css";
import { Button } from "@/components/ui/button";
import { Copyright } from "lucide-react";
import Link from "next/link";
import { FontDataContextProvider } from "./_components/font-data-privider";

export const metadata: Metadata = {
  title: "Ephemeral",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
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

  return (
    <html lang="ja">
      <body className={font.className}>
        <FontDataContextProvider fontData={font}>
          <div className="flex justify-center">
            <div className="max-w-md w-full">
              <SessionProvider session={session}>
                <div className="flex flex-col bg-gray-100">
                  <div className="flex flex-col h-screen overflow-y-hidden">
                    <div className="w-full bg-white py-2 px-6">
                      <MainHeader />
                    </div>

                    <div className="flex-1 flex flex-col overflow-x-hidden">
                      <main className="w-full flex-grow p-6">{children}</main>
                    </div>

                    <div className="flex flex-col gap-4 bg-white px-4 py-6">
                      <div className="flex items-center gap-2">
                        <Copyright size={14} />
                        <span>2024</span>
                        <span>@a10adotapp</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 h-8">
                          <Link href="https://github.com/a10adotapp/ephemeral.a10a.app">
                            <svg
                              role="img"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-[1em]">
                              <title>GitHub</title>
                              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                            </svg>
                            Github
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </SessionProvider>
            </div>
          </div>
        </FontDataContextProvider>

        <Toaster />

        <ErrorToast />
      </body>
    </html>
  );
}
