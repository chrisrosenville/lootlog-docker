import { Separator } from "@/components/ui/separator";

export default function LikesPage() {
  return (
    <div className="flex flex-col p-6">
      <h1 className="text-3xl font-bold tracking-tight">Likes</h1>
      <p className="text-neutral-400">All your favorite articles</p>
      <Separator className="my-4" />

      <div>
        <h2>Coming soon</h2>
      </div>
    </div>
  );
}
