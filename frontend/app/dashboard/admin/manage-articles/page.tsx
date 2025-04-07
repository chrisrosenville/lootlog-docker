"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { useModalStore } from "@/store/modal-store";
import { useAuthStore } from "@/store/auth-store";

import { apiClient } from "@/utils/apiClient";

import { IArticle } from "@/types/article.types";

import { LoadingScreen } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Table, TableColumn } from "@/components/tables/Table";

export default function ManageArticlesPage() {
  const user = useAuthStore((state) => state.user);
  const modal = useModalStore();

  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      if (user) {
        return await apiClient.fetch(`/articles`, {
          method: "GET",
        });
      }
    },
  });

  console.log("Articles:", data);

  const handleDelete = async (id: number) => {
    console.log(id);
  };

  const onPressDelete = async (id: number) => {
    modal.show(
      "Delete article",
      `Are you sure you want to delete this article?`,
      "Cancel",
      () => handleDelete(id),
      (onConfirm) => (
        <Button
          className="bg-red-600 text-white hover:bg-red-700"
          onClick={onConfirm}
        >
          Delete
        </Button>
      ),
    );
  };

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
      key: "author",
      header: "Author",
      render: (article: IArticle) => article.author?.userName || "No author",
    },
    {
      key: "actions",
      header: "",
      render: (article: IArticle) => {
        return (
          <div className="flex justify-end space-x-2">
            <Link href={`articles/${article.id}`}>
              <Button className="">Manage</Button>
            </Link>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => onPressDelete(article.id)}
            >
              Delete
            </Button>
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
