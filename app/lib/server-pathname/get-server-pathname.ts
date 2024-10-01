import { headers } from "next/headers";

export function getServerPathname(): string | null {
  return headers().get("x-pathname");
}
