import React from "react";
import { FaPen } from "react-icons/fa";

const UserInfo = () => {
  return (
    <div className="absolute top-0 right-0 z-50 w-full h-full bg-neutral-100 dark:bg-neutral-900 dark:text-white">
      <div className="w-full h-full ">
        <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
          <div className="relative">
            <img
              alt="User"
              className="w-32 h-32 border-4 border-gray-300 rounded-full dark:border-gray-700"
              src="https://via.placeholder.com/150"
            />
            <button className="absolute bottom-0 right-0 p-2 text-white rounded-full shadow-lg bg-violet-700 hover:bg-violet-500">
              <FaPen />
            </button>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-semibold">John Doe</h3>
            <p className="text-gray-500 dark:text-gray-300">
              john.doe@example.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
