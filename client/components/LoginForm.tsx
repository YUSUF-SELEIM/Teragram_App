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
        "http://localhost:5000/api/set-cookie",
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
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold text-center text-black transition-transform duration-200 transform dark:text-white hover:scale-105">
        Log In
      </h2>
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
      <Button
        className="w-full text-white bg-violet-700"
        type="submit"
        variant="shadow"
      >
        {isLoading ? <Spinner color="white" size="sm" /> : "Log In"}
      </Button>
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
