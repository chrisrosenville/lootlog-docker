"use client";
import Link from "next/link";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth-store";

import { apiClient } from "@/utils/apiClient";

import { IArticle } from "@/types/article.types";

import { LoadingScreen } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Table, TableColumn } from "@/components/tables/Table";

export default function ManageArticlesPage() {
  const user = useAuthStore((state) => state.user);

  const { data, isLoading } = useQuery({
    queryKey: ["articles", user?.id],
    queryFn: async () => {
      if (user) {
        return await apiClient.fetch(`/articles/author/${user.id}`, {
          method: "GET",
        });
      }
    },
  });

  const columns: TableColumn<IArticle>[] = [
    {
      key: "id",
      header: "ID",
    },
    {
      key: "title",
      header: "Title",
    },
    {
      key: "category",
      header: "Category",
      render: (article: IArticle) => article.category?.name || "No category",
    },
    {
      key: "status",
      header: "Status",
      render: (article: IArticle) => article.status?.status || "No status",
    },
    {
      key: "actions",
      header: "",
      render: (article: IArticle) => {
        return (
          <div className="flex justify-end space-x-2">
            <Link href={`my-articles/${article.id}`}>
              <Button className="">Manage</Button>
            </Link>
          </div>
        );
      },
    },
  ];

  if (!data?.articles || isLoading) return <LoadingScreen />;

  return (
    <div className="flex flex-col">
      <Table
        data={data?.articles}
        columns={columns}
        caption="All articles"
        className="rounded-md bg-neutral-900"
      />
    </div>
  );
}
