import type { User as PrismaUser } from "@/prisma/generated/client";
import "next-auth";
import type { ISODateString } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: PrismaUser;
    expires: ISODateString;
  }

  interface User {
    id: string; // User::uuid
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string; // Session::uuid
  }
}
