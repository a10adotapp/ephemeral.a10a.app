import { Button, type ButtonProps } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function NewButton({
  children,
  href,
  ...rest
}: {
  children: ReactNode;
  href?: string;
} & ButtonProps) {
  if (href) {
    return (
      <Button
        asChild
        {...rest}>
        <Link href={href}>
          <span className="flex items-center gap-1">
            <Plus size={16} />
            {children}
          </span>
        </Link>
      </Button>
    );
  }

  return null;
}
