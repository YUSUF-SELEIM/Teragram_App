"use client";
import { useState, useEffect } from "react";
import nookies from "nookies";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

import Dashboard from "@/components/dashboard";
import Sidebar from "@/components/sidebar";
import Chat from "@/components/chat ";

interface TokenPayload {
  id: string;
}

const ChatPage = ({ params }: { params: { id: string } }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isDashboardVisible, setIsDashboardVisible] = useState<boolean>(false);
  const [isUserInfoVisible, setIsUserInfoVisible] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    // Check for the token in the cookies
    const cookies = nookies.get();
    const token = cookies.token;

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

  const toggleDashboard = () => {
    setIsDashboardVisible((prev) => !prev);
  };
  const toggleUserInfo = () => {
    setIsUserInfoVisible((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isDashboardVisible ? "w-24" : "w-0"}`}
      >
        <Dashboard toggleUserInfo={toggleUserInfo} />
      </div>
      <Sidebar
        id={params.id}
        isUserInfoVisible={isUserInfoVisible}
        toggleDashboard={toggleDashboard}
      />
      <Chat />
    </div>
  );
};

export default ChatPage;
