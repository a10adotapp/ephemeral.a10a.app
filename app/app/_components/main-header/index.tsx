"use client";

import { Aside } from "./_components/aside";

export function MainHeader() {
  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex items-center gap-2">
        <Aside />

        <h1 className="font-bold">Ephemeral</h1>
      </div>
    </div>
  );
}
