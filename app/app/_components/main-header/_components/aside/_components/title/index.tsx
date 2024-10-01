"use client";

import Link from "next/link";

export function Title() {
  return (
    <Link
      href="/"
      className="text-xl font-bold">
      <div className="flex flex-col items-start gap-1">
        <span>Ephemeral</span>
      </div>
    </Link>
  );
}
