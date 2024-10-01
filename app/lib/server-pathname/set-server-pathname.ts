import type { NextRequest } from "next/server";

export function setServerPathname(request: NextRequest): NextRequest {
  request.headers.set("x-pathname", request.nextUrl.pathname);

  return request;
}
