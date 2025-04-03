"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/store/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    if (user === undefined) {
      checkAuthStatus();
    }
  }, [user, checkAuthStatus]);

  return <>{children}</>;
}
