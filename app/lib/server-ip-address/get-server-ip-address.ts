import { headers } from "next/headers";

export function getServerIpAddress(): string | null {
  return headers().get("x-forwarded-for");
}
