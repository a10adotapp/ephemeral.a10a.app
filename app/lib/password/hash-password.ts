import { hash } from "bcrypt";

export async function hashPassword(rawPassword: string): Promise<string> {
  return hash(rawPassword, 10);
}
