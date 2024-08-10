import React, { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { Spinner } from "@nextui-org/react";
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
}: {
  id: string;
  shouldRefetch: boolean;
}) {
  const { data, loading, error, refetch } = useQuery(GET_USER_CHATS, {
    variables: { userChatsId: id },
    skip: !id, // Skip the query if id is not provided
  });

  useEffect(() => {
    if (shouldRefetch) {
      refetch();
    }
  }, [shouldRefetch, refetch]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Spinner color="secondary" />
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul className="w-full h-full py-4">
      {data.userChats.map((chat: any) => {
        const lastMessage = chat.messages[chat.messages.length - 1]?.content;

        return (
          <button
            key={chat.id}
            className="flex items-center w-full p-2 space-x-4 rounded-md cursor-pointer dark:bg-neutral-900 hover:bg-white dark:hover:bg-neutral-800"
            // onClick={route to/c/chatid}
          >
            <Image
              alt={chat.users[0]?.name || "User Avatar"}
              className="rounded-full"
              height={42}
              src={
                chat.users[0]?.imageUrl ||
                `https://avatar.iran.liara.run/username?username=${chat.users[0]?.name}`
              }
              width={42}
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
  );
}

export default UserChats;
