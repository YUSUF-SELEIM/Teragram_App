"use client";
import { useState, useEffect } from "react";
import nookies from "nookies";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";

interface User {
  id: string;
  name: string;
}

interface TokenPayload {
  id: string;
}

const ChatPage = ({ params }: { params: { id: string } }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Check for the token in the cookies
    const cookies = nookies.get();
    console.log("Cookies:", cookies); // Log all cookies to check what’s available

    const token = cookies.token;
    console.log("Token:", token);

    if (token) {
      try {
        // Decode the token to get the user ID
        const decodedToken = jwtDecode<TokenPayload>(token);
        console.log("Decoded Token:", decodedToken);

        // Check if the token ID matches the params ID
        if (decodedToken.id === params.id) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          router.push("/"); // Redirect if IDs do not match
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setIsLoggedIn(false);
        router.push("/"); // Redirect if token is invalid
      }
    } else {
      setIsLoggedIn(false);
      router.push("/"); // Redirect if no token
    }
  }, [params.id, router]);

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-200">
        <h2 className="text-xl font-bold">Users</h2>
        {params.id}
        <button
          className="px-4 py-2 mt-4 text-white bg-red-600 rounded"
          onClick={() => {
            // Handle logout logic
            nookies.destroy(null, "token"); // Destroy token cookie
            router.push("/"); // Redirect after logout
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
