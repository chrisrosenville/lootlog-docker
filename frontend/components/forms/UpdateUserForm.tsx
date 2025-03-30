"use client";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { TUser } from "@/types/user.types";
import { userSchema } from "@/lib/schemas/userSchemas";
import { updateUser } from "@/lib/db/users";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";

type Props = {
  user: TUser;
};

export const UpdateUserForm = ({ user }: Props) => {
  const [statusMessage, setStatusMessage] = useState<string[]>([]);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: user.id,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      isAuthor: user.isAuthor,
    },
  });

  async function onSubmit(values: z.infer<typeof userSchema>) {
    try {
      const res = await updateUser(values);
      const status = await res?.json();

      if (res?.ok) {
        toast.success(
          <p className="text-neutral-950">The user has been updated</p>,
        );
        window.location.href = "/dashboard/admin/users";
        return;
      } else {
        setStatusMessage(status.message);
        console.error("Failed to update user:", status);
        toast.error(
          <p className="text-neutral-950">
            An error occurred while updating the user. Please try again later.
          </p>,
        );
        return;
      }
    } catch (error) {
      console.error("Form error:", error);
      toast.error(
        <p className="text-neutral-950">
          An unknown error occurred. Please try again later.
        </p>,
      );
    }
  }

  return (
    <Form {...form}>
      {statusMessage && <p className="text-red-600">{statusMessage}</p>}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl space-y-2 py-10"
      >
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  autoComplete="username"
                  type="text"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  autoComplete="firstname"
                  type="text"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  autoComplete="lastname"
                  type="text"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  autoComplete="email"
                  type="email"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col space-x-4 py-2 sm:flex-row">
          <FormField
            control={form.control}
            name="isVerified"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center rounded-md bg-neutral-800 p-4">
                <FormLabel>Verified</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={() => field.onChange(!field.value)}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isAuthor"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center rounded-md bg-neutral-800 p-4">
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={() => field.onChange(!field.value)}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isAdmin"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center rounded-md bg-neutral-800 p-4">
                <FormLabel>Admin</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={() => field.onChange(!field.value)}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Update</Button>
      </form>
    </Form>
  );
};
