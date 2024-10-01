import { headers } from "next/headers";

export function getServerUserAgent(): string | null {
  return headers().get("user-agent");
}
