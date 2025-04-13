"use client";
import { useAuthStore } from "@/store/auth-store";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { logout } = useAuthStore();

  return (
    <div className="flex flex-col p-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <p className="text-neutral-400">Update preferences for your account.</p>
      <Separator className="my-4" />

      <div>
        <Button onClick={() => logout()}>Sign out</Button>
      </div>
    </div>
  );
}
