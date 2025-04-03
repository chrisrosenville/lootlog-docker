"use client";

import { UserProfileForm } from "@/components/forms/UserProfileForm";
import { Separator } from "@/components/ui/separator";

export default function AccountPage() {
  return (
    <div className="flex flex-col p-6">
      <h1 className="text-3xl font-bold tracking-tight">Your profile</h1>
      <p className="text-neutral-400">
        Here you can see and update your information.
      </p>
      <Separator className="my-4" />

      <UserProfileForm />
    </div>
  );
}
