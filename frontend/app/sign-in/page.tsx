"use client";
import { redirect } from "next/navigation";

import { SignInForm } from "@/components/forms/SignInForm";
import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, checkAuthStatus, isLoading } = useAuthStore();

  useEffect(() => {
    if (user && !isLoading) {
      redirect("/dashboard");
    }

    if (user === undefined && !isLoading) {
      checkAuthStatus();
    }
  }, [user, isLoading, checkAuthStatus]);

  return <SignInForm />;
}
