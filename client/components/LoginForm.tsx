import { Button, Input } from "@nextui-org/react";
import { AiFillMail, AiFillLock } from "react-icons/ai";

function LoginForm({ setIsSignUp }: { setIsSignUp: (value: boolean) => void }) {
  return (
    <form className="space-y-4">
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
        />
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
        />
      </div>

      <Button className="w-full text-white bg-violet-700" variant="shadow">
        Sign In
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