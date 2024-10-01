import logger from "@/lib/logger";
import type { NextAuthOptions } from "next-auth";
import { z } from "zod";
import { createSession } from "./actions/create-session";
import { getSessionByUuid } from "./actions/get-session-by-uuid";
import { getUser } from "./actions/get-user";
import { getUserByUuid } from "./actions/get-user-by-uuid";
import { CredentialsProvider } from "./credentials-provider";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [CredentialsProvider()],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    jwt: async ({ token, user: authUser, trigger }) => {
      try {
        if (trigger === "signIn") {
          const userUuid = z.string().parse(authUser?.id);

          const user = await getUserByUuid(userUuid);

          if (!user) {
            throw new Error("user not found");
          }

          const session = await createSession(user);

          if (!session) {
            throw new Error("session not found");
          }

          return {
            ...token,
            sub: session?.uuid,
          };
        }

        if (trigger === undefined) {
          return token;
        }

        throw new Error("unhandled trigger");
      } catch (err) {
        logger.error({
          error: err,
          token,
          user: authUser,
          trigger,
        });
      }

      return token;
    },
    session: async ({ session: authSession, token }) => {
      try {
        const session = await getSessionByUuid(token.sub);

        if (!session) {
          throw new Error("session not found");
        }

        const user = await getUser(session.userId);

        if (!user) {
          throw new Error("user not found");
        }

        return {
          ...authSession,
          user,
        };
      } catch (err) {
        logger.error({
          error: err,
          token,
          session: authSession,
        });

        throw new Error("unauthorized");
      }
    },
  },
};
