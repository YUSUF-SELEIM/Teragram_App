import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";

export default function PopOver({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Popover
        isOpen={isOpen}
        placement="top-end"
        onOpenChange={(open) => setIsOpen(open)}
      >
        <PopoverTrigger>{children}</PopoverTrigger>
        <PopoverContent>
          <div className="p-4">
            <h2 className="text-xl font-bold">User Info</h2>
            <p>Name: John Doe</p>
            <p>Email: john.doe@example.com</p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
