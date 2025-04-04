"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "react-hot-toast";

import { apiClient } from "@/utils/apiClient";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const SignUpForm = () => {
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  async function formAction() {
    try {
      const res = await apiClient.fetch("/auth/sign-up", {
        method: "POST",
        body: JSON.stringify({
          username,
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res);
      toast.success(res.message, { position: "top-center" });
      router.push("/sign-in");
    } catch (err) {
      setErrorMessage("An unknown error occurred");
      console.log(err);
    }
  }

  return (
    <div className="flex h-full w-full flex-1 flex-col overflow-y-scroll bg-constellation bg-repeat p-4 sm:justify-center">
      <div className="mx-auto w-full min-w-[300px] max-w-xl rounded-md bg-neutral-900 p-8">
        <h2 className="mb-8 text-center text-3xl font-bold">Sign up</h2>

        {errorMessage && (
          <p className="mb-4 text-center text-red-600">{errorMessage}</p>
        )}

        <form className="flex flex-col gap-4" action={formAction}>
          <div className="flex flex-col gap-1">
            <label className="text-sm" htmlFor="userName">
              Username
            </label>
            <Input
              type="text"
              name="userName"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm" htmlFor="firstName">
              First name
            </label>
            <Input
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm" htmlFor="lastName">
              Last name
            </label>
            <Input
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm" htmlFor="email">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm" htmlFor="password">
              Password
            </label>
            <Input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm" htmlFor="confirmPassword">
              Confirm password
            </label>
            <Input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            Create account
          </Button>
        </form>

        <div className="mt-8 flex flex-col items-center space-y-4">
          <p className="text-center text-sm">
            {"Already have an account?"}{" "}
            <Link
              href="/sign-in"
              className="text-sm underline underline-offset-2"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
