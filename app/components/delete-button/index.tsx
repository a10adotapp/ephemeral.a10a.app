import { Button, type ButtonProps } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { ReactNode } from "react";

export function DeleteButton({
  children,
  ...rest
}: {
  children?: ReactNode;
  href?: string;
} & ButtonProps) {
  return (
    <Button
      asChild
      variant="destructive"
      size="sm"
      {...rest}>
      <span className="flex items-center gap-1">
        <Trash2 size={16} />
        {children || "削除"}
      </span>
    </Button>
  );
}
