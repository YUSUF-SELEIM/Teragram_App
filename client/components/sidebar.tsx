import React, { useState } from "react";
import Image from "next/image";
import { FaPen } from "react-icons/fa";

import Search from "./search";
import UserInfo from "./userInfo";
import PopOver from "./popover";
import Users from "./users";
import UserChats from "./userChats";

function Sidebar({
  id,
  isUserInfoVisible,
  handleChatClick,
}: {
  id: string;
  isUserInfoVisible: boolean;
  handleChatClick: (chatId: string) => void;
}) {
  const [isUsersVisible, setIsUsersVisible] = useState<boolean>(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  // Function to trigger refetch
  const triggerRefetch = () => {
    setShouldRefetch(true);
    // After refetch, reset the state
    setTimeout(() => setShouldRefetch(false), 0);
  };

  return (
    <div className="relative flex flex-col h-full w-[87%] p-4 md:w-[30%] bg-neutral-100 dark:bg-neutral-900 dark:text-white ">
      <div className="flex items-center w-full space-x-2">
        <Image
          alt="logo"
          className="transition-transform transform cursor-pointer duration-250 hover:rotate-12"
          height={50}
          src="/logo.png"
          width={50}
        />
        <Search />
      </div>
      <UserChats
        handleChatClick={handleChatClick}
        id={id}
        shouldRefetch={shouldRefetch}
      />
      {isUserInfoVisible && <UserInfo />}
      {isUsersVisible && (
        <Users
          myId={id}
          setIsUsersVisible={setIsUsersVisible}
          onChatCreated={triggerRefetch}
        />
      )}
      <div className="flex items-end justify-end w-full">
        <PopOver setIsUsersVisible={setIsUsersVisible}>
          <button className="p-5 text-white rounded-full shadow-2xl bg-violet-700">
            <FaPen className="text-lg transition-transform transform text-md duration-250 hover:-rotate-12" />
          </button>
        </PopOver>
      </div>
    </div>
  );
}

export default Sidebar;
