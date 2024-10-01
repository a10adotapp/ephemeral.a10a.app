import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

export function FormSubmitButton({
  label,
  isBusy,
}: {
  label?: string;
  isBusy?: boolean;
}) {
  return (
    <Button
      variant="default"
      disabled={isBusy}>
      <div className="flex justify-center items-center gap-1">
        <Loader
          size={16}
          className={cn(
            ...((isBusy ?? false) ? ["animate-spin"] : ["invisible"]),
          )}
        />

        <span>{label ?? "保存"}</span>

        <span className="w-[16px]" />
      </div>
    </Button>
  );
}
