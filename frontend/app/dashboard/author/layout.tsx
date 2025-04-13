import { RoleGuard } from "@/components/guards/RoleGuard";

export default async function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard requiredRoles={["admin", "author"]}>{children}</RoleGuard>;
}
