"use client";

import { logout } from "@/lib/db/auth";

import { Button } from "../ui/button";
import { useState } from "react";
import { LoadingSpinner } from "../ui/loading";

export const SignOut = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signOut = async () => {
    setIsLoading(true);

    try {
      const res = await logout().then((res) => res.json());

      if (res.ok === true) {
        window.location.href = "/";
      } else {
        console.log("Logout error:", res);
      }
    } catch (err) {
      console.log("Caught logout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={signOut}>
      {isLoading ? <LoadingSpinner theme="dark" /> : "Sign out"}
    </Button>
  );
};
