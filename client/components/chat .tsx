import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import Image from "next/image";
import { Chip, Spinner } from "@nextui-org/react";

import ChatInput from "./chatInput";
import ChatHeader from "./chatHeader";

const GET_CHAT_BY_ID = gql`
  query GetChatById($id: ID!) {
    getChatById(id: $id) {
      users {
        id
        name
      }
    }
  }
`;

const GET_MESSAGES_BY_CHAT_ID = gql`
  query GetMessagesByChatId($chatId: ID!) {
    getMessagesByChatId(chatId: $chatId) {
      id
      content
      createdAt
      sender {
        id
        name
      }
    }
  }
`;

const ADD_MESSAGE = gql`
  mutation AddMessage($chatId: ID!, $content: String!) {
    addMessage(chatId: $chatId, content: $content) {
      sender {
        email
      }
      content
      createdAt
      id
      chat {
        id
        type
        users {
          name
        }
      }
    }
  }
`;

function Chat({
  chatId,
  currentUserId,
  handleBackClick,
  isChatVisible,
}: {
  chatId: string | null;
  currentUserId: string;
  handleBackClick: () => void;
  isChatVisible: boolean;
}) {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const { data: chatData } = useQuery(GET_CHAT_BY_ID, {
    variables: { id: chatId },
    skip: !chatId,
  });

  const { data, loading, error } = useQuery(GET_MESSAGES_BY_CHAT_ID, {
    variables: { chatId },
    skip: !chatId,
  });

  const [addMessage] = useMutation(ADD_MESSAGE, {
    update(cache, { data: { addMessage } }) {
      cache.modify({
        fields: {
          getMessagesByChatId(existingMessages = []) {
            const newMessageRef = cache.writeFragment({
              data: addMessage,
              fragment: gql`
                fragment NewMessage on Message {
                  id
                  content
                  createdAt
                  sender {
                    id
                    name
                  }
                }
              `,
            });

            return [...existingMessages, newMessageRef];
          },
        },
      });
    },
  });

  const handleSendMessage = () => {
    if (!message && !image) return;

    addMessage({
      variables: {
        chatId,
        content: message,
      },
    });

    setMessage("");
    setImage(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
    }
  };

  const formatDate = (timestamp: string | number) => {
    const date = new Date(parseInt(timestamp as string));

    const formattedDate = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${formattedDate} ${formattedTime}`;
  };

  // Get the user's name that the current user is chatting with
  const chattingWithUser = chatData?.getChatById?.users.find(
    (user: any) => user.id !== currentUserId,
  );

  if (loading)
    return (
      <div className="hidden md:flex flex-col items-center justify-center md:w-[70%] w-full h-full bg-violet-700 dark:bg-neutral-950">
        <Spinner color="white" />
      </div>
    );
  if (error) return <p>Error loading messages.</p>;

  return (
    <>
      {isChatVisible && (
        <div className="absolute right-0 z-50 md:w-[70%] w-full h-full md:block dark:bg-black bg-violet-700 bg-gradient-to-br">
          <ChatHeader
            chattingWithName={chattingWithUser?.name || null}
            handleBackClick={handleBackClick}
          />

          {!chatId && (
            <div className="flex items-center justify-center w-full h-full md:block">
              <Image
                alt={"logo"}
                className="transition-transform transform duration-250 hover:-rotate-12"
                height={150}
                src="/logo.png"
                width={150}
              />
            </div>
          )}
          {chatId && (
            <div className="flex flex-col w-full h-screen space-y-4 ">
              <div className="h-full p-4 mt-20 space-y-3 overflow-y-auto scrollbar scrollbar-w-2 scrollbar-thumb-neutral-200 scrollbar-track-violet-700 dark:scrollbar-track-neutral-950 dark:scrollbar-thumb-neutral-700">
                {data?.getMessagesByChatId.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender.id === currentUserId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <Chip
                      className={`py-1 px-[0.1rem] rounded-2xl max-w-xs h-full shadow-xl ${
                        msg.sender.id === currentUserId
                          ? "bg-violet-900 bg-gradient-to-r "
                          : "dark:bg-neutral-900 bg-neutral-100 bg-gradient-to-l"
                      }`}
                    >
                      <p
                        className={`text-base text-start ${
                          msg.sender.id === currentUserId
                            ? " text-white "
                            : " dark:text-white text-black"
                        }`}
                      >
                        {msg.content}
                      </p>
                      <p
                        className={`text-[0.6rem] text-end ${
                          msg.sender.id === currentUserId
                            ? "bg-gradient-to-r text-white "
                            : " dark:text-white text-black"
                        }`}
                      >
                        {formatDate(msg.createdAt)}
                      </p>
                    </Chip>
                  </div>
                ))}
              </div>

              <ChatInput
                handleImageChange={handleImageChange}
                handleSendMessage={handleSendMessage}
                image={image}
                message={message}
                setMessage={setMessage}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Chat;
