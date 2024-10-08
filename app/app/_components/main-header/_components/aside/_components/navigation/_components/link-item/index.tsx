import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useMemo } from "react";

export function LinkItem({
  href,
  label,
  eyecatch,
  onClicked,
}: {
  href: string;
  label: string;
  eyecatch: ReactNode;
  onClicked?: () => void;
}) {
  const pathname = usePathname();

  const isActive = useMemo(() => {
    const activePattern = new RegExp(`^(?:${href}|${href}/.*)$`);

    return activePattern.test(pathname);
  }, [href, pathname]);

  return (
    <Button
      asChild
      variant={isActive ? "secondary" : "ghost"}
      disabled={isActive}
      className="flex gap-2 justify-start items-center">
      <Link
        href={href}
        onClick={onClicked}>
        {eyecatch}

        {label}
      </Link>
    </Button>
  );
}
