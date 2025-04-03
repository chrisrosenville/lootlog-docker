"use client";

import { useState } from "react";

import { toast } from "sonner";

import { LoadingScreen } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";
import { apiClient } from "@/utils/apiClient";

import { FormItem } from "./ui/FormItem";
import { FormLabel } from "./ui/FormLabel";

export const UserProfileForm = () => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  const [userName, setUserName] = useState<string>(user?.userName || "");
  const [firstName, setFirstName] = useState<string>(user?.firstName || "");
  const [lastName, setLastName] = useState<string>(user?.lastName || "");
  const [email, setEmail] = useState<string>(user?.email || "");

  const [errorMessage, setErrorMessage] = useState<string>("");

  if (isLoading) return <LoadingScreen />;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await apiClient.fetch("/auth/update-user", {
        method: "POST",
        body: JSON.stringify({ userName, firstName, lastName, email }),
      });

      if (res.OK) {
        toast.success("Successfully updated user profile!");
        window.location.reload();
      } else {
        setErrorMessage(res.message || "Failed to update user profile");
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
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
      <FormItem>
        <FormLabel>Username</FormLabel>
        <Input
          type="text"
          name="userName"
          value={user?.userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
      </FormItem>
      <FormItem>
        <FormLabel>First Name</FormLabel>
        <Input
          type="text"
          name="firstName"
          value={user?.firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </FormItem>
      <FormItem>
        <FormLabel>Last Name</FormLabel>
        <Input
          type="text"
          name="lastName"
          value={user?.lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </FormItem>
      <FormItem>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </FormItem>

      <Button type="submit" disabled={isLoading} className="max-w-20">
        {isLoading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
};
