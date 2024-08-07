import React from "react";
import { gql, useQuery } from "@apollo/client";
import { BiArrowBack } from "react-icons/bi";
import Image from "next/image";

import Search from "./search";

const GET_USERS = gql`
  query Users {
    users {
      id
      name
      email
      imageUrl
    }
  }
`;

function Users({
  setIsUsersVisible,
}: {
  setIsUsersVisible: (value: boolean) => void;
}) {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.cause?.message}</p>;
  const isUserSelected = (userId: String) => {
    setIsUsersVisible(false);
    console.log(userId);
  };

  return (
    <div className="absolute top-0 right-0 z-50 w-full h-full bg-neutral-100 dark:bg-neutral-900 dark:text-white">
      <div className="flex space-x-4 items-center w-full p-4">
        <button
          className="dark:text-white"
          onClick={() => setIsUsersVisible(false)}
        >
          <BiArrowBack className="text-2xl transform hover:scale-125 hover:text-violet-400" />
        </button>
        <Search />
      </div>
      <ul className="space-y-1 p-2">
        {data.users.map((user: any) => (
          <button
            key={user.id}
            className="flex items-center space-x-4 p-2  dark:bg-neutral-900 rounded-md w-full hover:bg-white dark:hover:bg-neutral-800 cursor-pointer"
            onClick={() => isUserSelected(user.id)}
          >
            <Image
              alt={user.name}
              className=" rounded-full"
              height={42}
              src={
                user.imageUrl ||
                `https://avatar.iran.liara.run/username?username=${user.name}`
              }
              width={42}
            />
            <div className="min-w-0 text-left">
              <h2 className="text-md  truncate">{user.name}</h2>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
          </button>
        ))}
      </ul>
    </div>
  );
}

export default Users;
