"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/utils/apiClient";
import { useAuthStore } from "@/store/auth-store";

export const SignInForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const setUser = useAuthStore((state) => state.setUser);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  const router = useRouter();

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    try {
      const res = await apiClient.fetch("/auth/sign-in", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (res.OK) {
        setUser(res.user);
        toast.success(res.message, { position: "top-center" });
        router.push("/dashboard");
      } else {
        setErrorMessage(res.message || "Failed to sign in");
      }
    } catch (err) {
      console.log(err);
      console.error("Sign in error:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
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
            <p className="text-center text-white">{errorMessage}</p>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
            <div className="flex flex-col gap-1">
              <label className="text-sm" htmlFor="email">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                required
              />
            </div>

            <Button type="submit">Login</Button>
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
