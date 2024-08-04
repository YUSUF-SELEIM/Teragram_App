"use client";
import { useState } from "react";

import { ThemeSwitch } from "@/components/theme-switch";
import SignUpForm from "@/components/SignUpForm";
import LoginForm from "@/components/LoginForm";

export default function Home() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <section className="flex h-screen bg-white dark:bg-black ">
      <div className="hidden w-2/3 shadow-2xl Teragram md:block " />
      <div className="flex flex-col items-center justify-center w-full border border-violet-700 md:w-1/2">
        <div className="absolute top-0 right-0 p-4">
          <ThemeSwitch />
        </div>
        <h1 className="my-5 text-4xl font-bold text-center text-black transition-transform duration-200 transform dark:text-white hover:scale-105">
          Tera<span className="text-violet-700">Gram</span>
        </h1>
        <div className="flex flex-col w-full max-w-md p-4 space-y-6 dark:bg-black">
          {isSignUp ? (
            <SignUpForm setIsSignUp={setIsSignUp} />
          ) : (
            <LoginForm setIsSignUp={setIsSignUp} />
          )}
        </div>
      </div>
    </section>
  );
}
