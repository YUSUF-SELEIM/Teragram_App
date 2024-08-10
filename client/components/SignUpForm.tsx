import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiFillMail, AiFillLock } from "react-icons/ai";
import { Button, Input, Spinner } from "@nextui-org/react";
import { z } from "zod";

import { signUpSchema } from "../lib/ZodValidationSchema";

import { useAuth } from "@/hooks/useAuth";

type SignUpFormData = z.infer<typeof signUpSchema>;

function SignUpForm({
  setIsSignUp,
}: {
  setIsSignUp: (value: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    try {
      setIsLoading(true);
      console.log("Form data:", data);

      // Call the register mutation
      const response = await registerUser({
        variables: {
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        },
      });

      console.log("Registration successful:", response);

      // Redirect to login form
      setIsSignUp(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error registering:", error);
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Input
          className="dark:bg-black dark:border-white dark:text-white"
          label="Name"
          placeholder="Enter your name"
          {...register("name")}
          isInvalid={!!errors.name}
          variant="bordered"
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Input
          className="dark:bg-black dark:border-white dark:text-white"
          endContent={
            <AiFillMail className="flex-shrink-0 text-2xl pointer-events-none text-default-400 dark:text-white" />
          }
          label="Email"
          placeholder="Enter your email"
          {...register("email")}
          isInvalid={!!errors.email}
          variant="bordered"
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
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
          {...register("password")}
          isInvalid={!!errors.password}
          variant="bordered"
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
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
          {...register("confirmPassword")}
          isInvalid={!!errors.confirmPassword}
          variant="bordered"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <Button
        className="w-full text-white bg-violet-700"
        type="submit"
        variant="shadow"
      >
        {isLoading ? <Spinner color="white" size="sm" /> : "Sign Up"}
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
