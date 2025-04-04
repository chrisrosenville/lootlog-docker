import { ArticleForm } from "@/components/forms/ArticleForm";
import { RoleGuard } from "@/components/guards/RoleGuard";

export default async function CreateArticlePage() {
  return (
    <RoleGuard requiredRoles={["admin", "author"]}>
      <ArticleForm />
    </RoleGuard>
  );
}
