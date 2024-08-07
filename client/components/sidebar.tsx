import React, { useState } from "react";
import Image from "next/image";
import { FaPen } from "react-icons/fa";

import Search from "./search";
import UserInfo from "./userInfo";
import PopOver from "./popover";
import Users from "./users";

function Sidebar({
  id,
  toggleDashboard,
  isUserInfoVisible,
}: {
  id: string;
  toggleDashboard: () => void;
  isUserInfoVisible: boolean;
}) {
  const [isUsersVisible, setIsUsersVisible] = useState<boolean>(false);

  return (
    <div className="relative flex flex-col items-center justify-between w-full p-4 md:w-[45%] bg-neutral-100 dark:bg-neutral-900 dark:text-white">
      <div className="flex items-center w-full space-x-2">
        <Image
          alt="logo"
          className="transition-transform transform cursor-pointer duration-250 hover:rotate-12"
          height={50}
          src="/logo.png"
          width={50}
          onClick={toggleDashboard}
        />
        <Search />
      </div>
      {isUserInfoVisible && <UserInfo />}
      {isUsersVisible && <Users setIsUsersVisible={setIsUsersVisible} />}
      <div className="flex items-center justify-end w-full">
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
