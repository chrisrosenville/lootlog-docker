"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
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
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectTo);
      return;
    }

    console.log(user);

    if (!isLoading && user && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some((role) =>
        user.roles.includes(role),
      );

      if (!hasRequiredRole) {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, router, requiredRoles, redirectTo]);

  if (isLoading) {
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
