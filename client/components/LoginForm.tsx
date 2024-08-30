"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiFillMail, AiFillLock } from "react-icons/ai";
import { Button, Input, Spinner } from "@nextui-org/react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

import { loginSchema } from "../lib/ZodValidationSchema";

import { useAuth } from "@/hooks/useAuth";

type FormValues = {
  email: string;
  password: string;
};

function LoginForm({ setIsSignUp }: { setIsSignUp: (value: boolean) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
  });
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsLoading(true);
      const response = await login({
        variables: {
          email: data.email,
          password: data.password,
        },
      });

      const { token } = response.data.login;

      // Decode the token to get user info
      const decoded: any = jwtDecode(token);
      const userId = decoded.id;

      // Make a request to Express server to set the HttpOnly cookie
      const cookieResponse = await fetch(
        `${process.env.NEXT_PUBLIC_Back_End_URL}/api/set-cookie`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ token }),
        },
      );

      if (cookieResponse.ok) {
        console.log("Cookie set successfully");
      } else {
        console.error("Failed to set cookie");
      }
      router.push(`/chats/${userId}`);
      setIsLoading(false);
    } catch (error: any) {
      // Handling server-side errors
      const serverError = error.message;

      // Set server-side error message
      setError("password", { message: serverError });
      setIsLoading(false);
    }
  };

  // Handle test user login
  const handleTestUserLogin = async () => {
    try {
      // Set predefined test user credentials
      const testUser = {
        email: "123@yahoo.com",
        password: "123456",
      };

      // Set form values
      reset(testUser);

      // Submit the form with test user credentials
      await onSubmit(testUser);
    } catch (error) {
      console.error("Test user login failed:", error);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Input
          className="dark:bg-black dark:border-white dark:text-white"
          endContent={
            <AiFillMail className="flex-shrink-0 text-2xl pointer-events-none text-default-400 dark:text-white" />
          }
          label="Email"
          placeholder="Enter your email"
          variant="bordered"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Input
          className="dark:bg-black dark:border-white dark:text-white"
          endContent={
            <AiFillLock className="flex-shrink-0 text-2xl pointer-events-none text-default-400 dark:text-white" />
          }
          label="Password"
          placeholder="Enter your password"
          type="password"
          variant="bordered"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div className="flex space-x-4">
        <Button
          className="w-full text-white bg-violet-700"
          type="submit"
          variant="shadow"
        >
          {isLoading ? <Spinner color="white" size="sm" /> : "Log In"}
        </Button>
        <Button
          className="w-full text-white bg-gray-500"
          type="button"
          variant="shadow"
          onClick={handleTestUserLogin}
        >
          {isLoading ? <Spinner color="white" size="sm" /> : "Test User Login"}
        </Button>
      </div>
      <p className="text-sm text-center text-gray-600 dark:text-gray-300">
        Don&apos;t have an account?{" "}
        <button
          className="text-violet-700 hover:underline"
          type="button"
          onClick={() => setIsSignUp(true)}
        >
          Sign Up
        </button>
      </p>
    </form>
  );
}

export default LoginForm;
