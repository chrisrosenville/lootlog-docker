"use client";

import { useState } from "react";

import { toast } from "sonner";

import { LoadingScreen } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";
import { apiClient } from "@/utils/apiClient";

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
      <div className="flex flex-col gap-1">
        <label className="text-sm" htmlFor="userName">
          Username
        </label>
        <Input
          type="text"
          name="userName"
          value={user?.userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm" htmlFor="firstName">
          First Name
        </label>
        <Input
          type="text"
          name="firstName"
          value={user?.firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm" htmlFor="lastName">
          Last Name
        </label>
        <Input
          type="text"
          name="lastName"
          value={user?.lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
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
          required
        />
      </div>

      <Button type="submit" disabled={isLoading} className="max-w-20">
        {isLoading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
};
