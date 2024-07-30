import { Button, Input } from "@nextui-org/react";
import { AiFillMail, AiFillLock } from "react-icons/ai";

function SignUpForm({
  setIsSignUp,
}: {
  setIsSignUp: (value: boolean) => void;
}) {
  return (
    <form className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-black transition-transform duration-200 transform dark:text-white hover:scale-105">
        Sign Up
      </h2>
      <div>
        <Input
          className="dark:bg-black dark:border-white dark:text-white"
          label="Name"
          placeholder="Enter your name"
          variant="bordered"
        />
      </div>
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
      <div>
        <Input
          className="dark:bg-black dark:border-white dark:text-white"
          endContent={
            <AiFillLock className="flex-shrink-0 text-2xl pointer-events-none text-default-400 dark:text-white" />
          }
          label="Confirm Password"
          placeholder="Confirm your password"
          type="password"
          variant="bordered"
        />
      </div>
      <Button className="w-full text-white bg-violet-700" variant="shadow">
        Sign Up
      </Button>
      <p className="text-sm text-center text-gray-600 dark:text-gray-300">
        Already have an account?{" "}
        <button
          className="text-violet-700 hover:underline"
          type="button"
          onClick={() => setIsSignUp(false)}
        >
          Log In
        </button>
      </p>
    </form>
  );
}

export default SignUpForm;
