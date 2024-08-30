"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";

import Dashboard from "@/components/dashboard";
import Sidebar from "@/components/sidebar";
import Chat from "@/components/chat ";
interface TokenPayload {
  id: string;
}

const ChatPage = ({ params }: { params: { id: string } }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isUserInfoVisible, setIsUserInfoVisible] = useState<boolean>(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isChatVisible, setChatVisible] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the token to get the user ID
        const decodedToken = jwtDecode<TokenPayload>(token);

        // Check if the token ID matches the params ID
        if (decodedToken.id === params.id) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          router.push("/"); // Redirect if IDs do not match
        }
      } catch (error) {
        setIsLoggedIn(false);
        router.push("/"); // Redirect if token is invalid
      }
    } else {
      setIsLoggedIn(false);
      router.push("/"); // Redirect if no token
    }
  }, [params.id, router]);

  const toggleUserInfo = () => {
    setIsUserInfoVisible((prev) => !prev);
  };
  const handleChatClick = (chatId: string) => {
    setSelectedChatId(chatId);
    setChatVisible(true);
  };
  const handleBackClick = () => {
    setChatVisible(false);
  };

  return (
    <div className="flex h-screen">
      <Dashboard toggleUserInfo={toggleUserInfo} />
      <Sidebar
        handleChatClick={handleChatClick}
        id={params.id}
        isUserInfoVisible={isUserInfoVisible}
      />
      <Chat
        chatId={selectedChatId}
        currentUserId={params.id}
        handleBackClick={handleBackClick}
        isChatVisible={isChatVisible}
      />
      {!selectedChatId && (
        <div className="items-center justify-center w-[65%] h-full bg-neutral-50 dark:bg-black hidden md:flex">
          {selectedChatId}
          <Image
            alt={"logo"}
            className="cursor-pointer hover:blur-lg hover:animate-pulse"
            height={300}
            src="/logo.png"
            width={300}
          />
        </div>
      )}
    </div>
  );
};

export default ChatPage;
