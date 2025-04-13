"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { UpdateUserForm } from "@/components/forms/UpdateUserForm";
import { LoadingScreen } from "@/components/ui/loading";
import { apiClient } from "@/utils/apiClient";

export default function ManageUserPage() {
  const params: { id: string } = useParams();

  const { data } = useQuery({
    queryKey: ["user", params.id],
    queryFn: async () => await apiClient.fetch(`/users/${params.id}`),
  });

  if (!data?.user?.id) return <LoadingScreen />;

  return <UpdateUserForm user={data.user} />;
}
