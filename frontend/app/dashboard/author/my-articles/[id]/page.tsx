"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { LoadingScreen } from "@/components/ui/loading";
import { UpdateArticleForm } from "@/components/forms/UpdateArticleForm";
import { apiClient } from "@/utils/apiClient";
import { ArticleStatusEnum } from "@/types/articleStatus.types";

export default function EditArticlePage() {
  const params: { id: string } = useParams();

  const { data } = useQuery({
    queryKey: ["article", params.id],
    queryFn: async () =>
      apiClient.fetch(`/articles/${params.id}`, {
        method: "GET",
      }),
  });

  if (!data?.article) return <LoadingScreen />;

  if (
    data.article.status.status === ArticleStatusEnum.DRAFT ||
    data.article.status.status === ArticleStatusEnum.REJECTED
  ) {
    return <UpdateArticleForm articleProp={data.article} />;
  } else {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Article is not editable</h1>
        <p className="text-gray-500">
          This article is currently {data.article.status.status}. You cannot
          edit it.
        </p>
      </div>
    );
  }
}
