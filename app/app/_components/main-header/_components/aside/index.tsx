import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useCallback, useState } from "react";
import { Navigation } from "./_components/navigation";
import { SignOutButton } from "./_components/sign-out-button";
import { Title } from "./_components/title";

export function Aside() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openChange = useCallback((isOpen: boolean) => {
    setIsOpen(isOpen);
  }, []);

  const navigationItemClicked = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={openChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="px-2">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="bg-white">
        <SheetHeader>
          <SheetTitle>
            <Title />
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 py-4">
            <Navigation onItemClicked={navigationItemClicked} />
          </div>

          <div className="flex flex-col py-4">
            <SignOutButton />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
