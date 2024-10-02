import logger from "@/lib/logger";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers/index";
import { z } from "zod";
import { checkPassword } from "../password/check-password";
import { createUser } from "./actions/create-user";
import { getUserByUsername } from "./actions/get-user-by-username";

const credentialsSchema = z.union([
  z.object({
    asGuest: z.coerce.boolean().pipe(z.literal(true)),
  }),
  z.object({
    asGuest: z.coerce.boolean().pipe(z.literal(false)).optional(),
    username: z.string().min(1),
    password: z.string().min(1),
  }),
]);

export function CredentialsProvider(): Provider {
  return Credentials({
    credentials: {
      username: {},
      password: {},
      asGuest: {
        type: "boolean",
      },
    },
    authorize: async (credentials) => {
      try {
        const parsedCredentials = credentialsSchema.parse(credentials);

        if (parsedCredentials.asGuest) {
          const user = await createUser();

          return {
            id: user.uuid,
          };
        }

        if (!parsedCredentials.asGuest) {
          const user = await getUserByUsername(parsedCredentials.username);

          if (!user) {
            throw new Error("user not found");
          }

          const isPasswordValid = await checkPassword(
            parsedCredentials.password,
            z.string().min(1).parse(user.password),
          );

          if (isPasswordValid) {
            throw new Error("password invalid");
          }

          return {
            id: user.uuid,
          };
        }

        throw new Error("unhandled");
      } catch (err) {
        logger.error({
          error: err,
          credentials,
        });
      }

      return null;
    },
  });
}
