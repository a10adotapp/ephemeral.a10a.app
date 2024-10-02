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

                    <div className="flex flex-col overflow-x-hidden">
                      <main className="w-full flex-grow p-6">{children}</main>
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
