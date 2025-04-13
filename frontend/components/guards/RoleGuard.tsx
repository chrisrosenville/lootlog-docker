"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { UserRoles } from "@/types/user.types";
import { LoadingScreen } from "../ui/loading";

interface RoleGuardProps {
  children: ReactNode;
  requiredRoles?: UserRoles[];
  redirectTo?: string;
}

export function RoleGuard({
  children,
  requiredRoles = [],
  redirectTo = "/sign-in",
}: RoleGuardProps) {
  const { user, isLoading, checkAuthStatus } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      setIsCheckingAuth(true);

      if (!user) {
        await checkAuthStatus();
      }

      setIsCheckingAuth(false);
    }

    checkAuth();
  }, [checkAuthStatus, user]);

  useEffect(() => {
    if (!isCheckingAuth && !isLoading) {
      if (!user) {
        router.push(redirectTo);
        return;
      }

      if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some((role) =>
          user.roles.includes(role),
        );

        if (!hasRequiredRole) {
          router.push("/dashboard");
        }
      }
    }
  }, [isCheckingAuth, isLoading, redirectTo, requiredRoles, router, user]);

  if (isLoading || isCheckingAuth) {
    return <LoadingScreen />;
  }

  if (
    !user ||
    (requiredRoles.length > 0 &&
      !requiredRoles.some((role) => user.roles.includes(role)))
  ) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p className="text-sm text-gray-500">
          You are not authorized to access this page
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
