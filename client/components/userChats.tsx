import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Input, Spinner } from "@nextui-org/react";
import Image from "next/image";

const GET_USER_CHATS = gql`
  query UserChats($userChatsId: ID!) {
    userChats(id: $userChatsId) {
      id
      type
      users {
        id
        name
        imageUrl
      }
      messages {
        id
        content
      }
    }
  }
`;

function UserChats({
  id,
  shouldRefetch,
  handleChatClick,
}: {
  id: string;
  shouldRefetch: boolean;
  handleChatClick: (chatId: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const { data, loading, error, refetch } = useQuery(GET_USER_CHATS, {
    variables: { userChatsId: id },
    skip: !id, // Skip the query if id is not provided
  });

  useEffect(() => {
    if (shouldRefetch) {
      refetch();
    }
  }, [shouldRefetch, refetch]);

  // Filter chats based on the search term
  const filteredChats = data?.userChats.filter((chat: any) =>
    chat.users[0]?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Spinner color="secondary" />
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-2 w-full">
        <Image
          alt="logo"
          className="transition-transform transform cursor-pointer duration-250 hover:rotate-12"
          height={50}
          src="/logo.png"
          width={50}
        />
        <Input
          placeholder="Search Chats"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ul className="w-full h-full py-4">
        {filteredChats.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No chats found
          </p>
        )}
        {filteredChats.map((chat: any) => {
          const lastMessage = chat.messages[chat.messages.length - 1]?.content;

          return (
            <button
              key={chat.id}
              className="flex items-center w-full p-2 space-x-4 rounded-md cursor-pointer dark:bg-neutral-900 hover:bg-white dark:hover:bg-neutral-800"
              onClick={() => handleChatClick(chat.id)}
            >
              <img
                alt={chat.users[0]?.name || "User Avatar"}
                className="rounded-full w-10 h-10"
                src={
                  chat.users[0]?.imageUrl ||
                  `https://avatar.iran.liara.run/username?username=${chat.users[0]?.name}`
                }
              />
              <div className="min-w-0 text-left">
                <h2 className="truncate text-md">{chat.users[0]?.name}</h2>
                {lastMessage && (
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    {lastMessage}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </ul>
    </div>
  );
}

export default UserChats;
