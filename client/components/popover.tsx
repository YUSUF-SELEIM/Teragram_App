import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { BiSolidUserPlus, BiSolidGroup } from "react-icons/bi";

export default function PopOver({
  children,
  setIsUsersVisible,
}: {
  children: React.ReactNode;
  setIsUsersVisible: (value: boolean) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleUsers = () => {
    setIsOpen(false);
    setIsUsersVisible(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <Popover
        isOpen={isOpen}
        placement="top-end"
        onOpenChange={(open) => setIsOpen(open)}
      >
        <PopoverTrigger>{children}</PopoverTrigger>
        <PopoverContent>
          <div className="p-1 flex flex-col space-y-2">
            <button
              className="flex items-center justify-start w-full p-2 rounded-lg transition-all duration-200 transform hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:scale-105"
              onClick={toggleUsers}
            >
              <BiSolidUserPlus className="text-xl" />
              <span className="ml-2 flex-1 text-left">New Chat</span>
            </button>
            <button className="flex items-center justify-start w-full p-2 rounded-lg transition-all duration-200 transform hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:scale-105">
              <BiSolidGroup className="text-xl" />
              <span className="ml-2 flex-1 text-left">New Group</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
