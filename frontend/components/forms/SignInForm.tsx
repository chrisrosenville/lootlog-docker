"use client";
import { useState } from "react";
import Link from "next/link";

import { signInAction } from "@/lib/db/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const SignInForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  async function formAction() {
    setIsLoading(true);

    const data = new FormData();
    data.append("email", email);
    data.append("password", password);

    try {
      const res = await signInAction(data);

      if (res.OK === true) {
        toast.success("Signed in successfully");
        router.push("/");
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      setErrorMessage("An unknown error occurred");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex h-full w-full flex-1 flex-col justify-center overflow-y-scroll bg-constellation bg-repeat p-4">
        <div className="mx-auto w-full min-w-[300px] max-w-xl rounded-md bg-neutral-900 p-8">
          <h2 className="mb-8 text-3xl font-bold">Sign in</h2>

          {errorMessage && (
            <p className="text-center text-red-600">{errorMessage}</p>
          )}

          <form className="flex flex-col gap-4" action={formAction}>
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

            <Button type="submit" disabled={isLoading}>
              Login
            </Button>
          </form>

          <div className="mt-8 flex flex-col items-center space-y-4">
            <p className="text-center text-sm">
              {"Don't have an account yet?"}{" "}
              <Link
                href="/sign-up"
                className="text-sm underline underline-offset-2"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
