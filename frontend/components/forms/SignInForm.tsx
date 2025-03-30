"use client";
import { useState } from "react";
import Link from "next/link";

import { login } from "@/lib/db/auth";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading";
import { TAuthErrorResponse } from "@/types/form.types";

const formSchema = z.object({
  email: z.string().max(100),
  password: z.string().max(50),
});

export const SignInForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setErrorMessage("");
      setIsLoading(true);

      const res = await login(values);

      if (res.ok) {
        toast.success(
          <p className="text-neutral-950">You are now logged in</p>,
        );
        window.location.href = "/dashboard/user";
      } else {
        const credentialError = (await res.json()) as TAuthErrorResponse;

        setErrorMessage(credentialError.message);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Form submission error", error);
      toast.error(
        <p className="text-neutral-950">
          There was an unknown error. Please try again later.
        </p>,
      );
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

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="max-w-3xl space-y-3"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@lootlog.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription>Your email address.</FormDescription> */}
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link className="text-sm underline" href={""}>
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input placeholder="•••••" type="password" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                      The password for your account
                    </FormDescription> */}
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <Button disabled={isLoading}>
                  {isLoading ? <LoadingSpinner theme="dark" /> : "Sign in"}
                </Button>
              </div>
            </form>
          </Form>

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
