import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Chip, Spinner } from "@nextui-org/react";
import { CldImage } from "next-cloudinary";

import ChatInput from "./chatInput";
import ChatHeader from "./chatHeader";

const GET_CHAT_BY_ID = gql`
  query GetChatById($id: ID!) {
    getChatById(id: $id) {
      users {
        id
        name
        imageUrl
      }
    }
  }
`;

const GET_MESSAGES_BY_CHAT_ID = gql`
  query GetMessagesByChatId($chatId: ID!) {
    getMessagesByChatId(chatId: $chatId) {
      id
      content
      imageUrl
      createdAt
      sender {
        id
        name
      }
    }
  }
`;

const ADD_MESSAGE = gql`
  mutation AddMessage($chatId: ID!, $content: String!, $imageUrl: String) {
    addMessage(chatId: $chatId, content: $content, imageUrl: $imageUrl) {
      sender {
        email
      }
      content
      imageUrl
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
  const [image, setImage] = useState<String | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const messageContainerRef = useRef<HTMLDivElement>(null); // Ref for message container

  const { data: chatData } = useQuery(GET_CHAT_BY_ID, {
    variables: { id: chatId },
    skip: !chatId,
  });

  const { data, loading, error } = useQuery(GET_MESSAGES_BY_CHAT_ID, {
    variables: { chatId },
    skip: !chatId,
    pollInterval: 60000,
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
                    imageUrl
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

  const handleSendMessage = async () => {
    if (!message && !image) return;

    addMessage({
      variables: {
        chatId,
        content: message,
        imageUrl: image,
      },
    });
    setMessage("");
    setImage(null);
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();

      setIsUploading(true);

      formData.append("file", file);
      formData.append("upload_preset", "Teragram");

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await response.json();
        const imageUrl = data.secure_url;

        setImage(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
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

    return { formattedDate, formattedTime };
  };

  // Get the user's name and image URL that the current user is chatting with
  const chattingWithUser = chatData?.getChatById?.users.find(
    (user: any) => user.id !== currentUserId,
  );

  // Scroll to the bottom of the message container whenever new messages are added
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [data?.getMessagesByChatId]);

  if (loading)
    return (
      <div className="hidden md:flex flex-col items-center justify-center md:w-[65%] w-full h-full bg-violet-700 dark:bg-black">
        <Spinner color="white" />
      </div>
    );
  if (error) return <p>Error loading messages.</p>;

  let lastMessageDate = ""; // Track the date of the last message to insert date separators

  return (
    <>
      {isChatVisible && (
        <div className="absolute right-0 z-50 md:w-[65%] w-full h-full md:block dark:bg-black bg-violet-700 bg-gradient-to-br">
          <ChatHeader
            chattingWithImageUrl={chattingWithUser?.imageUrl || null}
            chattingWithName={chattingWithUser?.name || null}
            handleBackClick={handleBackClick}
          />
          {chatId && (
            <div className="flex flex-col w-full h-screen space-y-4 ">
              <div
                ref={messageContainerRef}
                className="h-full p-4 mt-20 space-y-3 overflow-x-hidden overflow-y-auto scrollbar scrollbar-w-2 scrollbar-thumb-neutral-200 scrollbar-track-violet-700 dark:scrollbar-track-neutral-950 dark:scrollbar-thumb-neutral-700"
              >
                {data?.getMessagesByChatId.map((msg: any) => {
                  const { formattedDate, formattedTime } = formatDate(
                    msg.createdAt,
                  );

                  const showDateSeparator = lastMessageDate !== formattedDate;

                  lastMessageDate = formattedDate;

                  return (
                    <React.Fragment key={msg.id}>
                      {showDateSeparator && (
                        <div className="my-2 text-sm text-center text-gray-200 dark:text-gray-400">
                          {formattedDate}
                        </div>
                      )}

                      <div
                        className={`flex ${
                          msg.sender.id === currentUserId
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <Chip
                          className={`py-1 px-[0.1rem] rounded-2xl h-full max-w-xs w-fit shadow-xl ${
                            msg.sender.id === currentUserId
                              ? "bg-violet-900 bg-gradient-to-r "
                              : "dark:bg-neutral-900 bg-neutral-100 bg-gradient-to-l"
                          }`}
                        >
                          {msg.imageUrl ? (
                            <CldImage
                              alt="Uploaded image"
                              className="my-2 rounded-2xl"
                              crop="scale"
                              height="200"
                              src={msg.imageUrl}
                              width="200"
                            />
                          ) : (
                            <p
                              className={`text-base text-start break-all whitespace-normal text-wrap ${
                                msg.sender.id === currentUserId
                                  ? " text-white "
                                  : " dark:text-white text-black"
                              }`}
                            >
                              {msg.content}
                            </p>
                          )}
                          <p
                            className={`text-[0.6rem] text-end ${
                              msg.sender.id === currentUserId
                                ? "bg-gradient-to-r text-white "
                                : " dark:text-white text-black"
                            }`}
                          >
                            {formattedTime}
                          </p>
                        </Chip>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
              <ChatInput
                handleImageChange={handleImageChange}
                handleSendMessage={handleSendMessage}
                image={image}
                isUploading={isUploading}
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
