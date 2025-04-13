import { RoleGuard } from "@/components/guards/RoleGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard requiredRoles={["admin"]}>{children}</RoleGuard>;
}
