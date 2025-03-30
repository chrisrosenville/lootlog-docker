"use client";

import { logout } from "@/lib/db/auth";

import { Button } from "../ui/button";
import { useState } from "react";
import { LoadingSpinner } from "../ui/loading";

export const SignOut = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{}>({});

  const signOut = async () => {
    setIsLoading(true);

    const res = await logout();

    if (res.ok) {
      window.location.href = "/";
    } else {
      const error = await res.json();

      setIsLoading(false);
      setError(error);
      console.log("Logout error:", error);
    }
  };

  return (
    <Button onClick={signOut}>
      {isLoading ? <LoadingSpinner theme="dark" /> : "Sign out"}
    </Button>
  );
};
