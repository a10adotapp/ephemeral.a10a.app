"use client";

import { Home } from "lucide-react";
import { LinkItem } from "./_components/link-item";

// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from "react";

export function Navigation({
  onItemClicked,
}: {
  onItemClicked?: () => void;
}) {
  const linkItemsData: Parameters<typeof LinkItem>[0][] = [
    {
      href: "/",
      label: "トップページ",
      eyecatch: <Home size={20} />,
    },
  ];

  return (
    <nav className="flex flex-col gap-1">
      {linkItemsData.map((linkItemData) => (
        <LinkItem
          key={linkItemData.href}
          onClicked={onItemClicked}
          {...linkItemData}
        />
      ))}
    </nav>
  );
}
