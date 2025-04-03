import { Separator } from "@/components/ui/separator";
import { SignOut } from "@/components/button/SignOut";

export default function SettingsPage() {
  return (
    <div className="flex flex-col p-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <p className="text-neutral-400">Update preferences for your account.</p>
      <Separator className="my-4" />

      <div>
        <SignOut />
      </div>
    </div>
  );
}
