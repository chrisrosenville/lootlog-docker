"use client";
import { useRouter } from "next/navigation";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useModalStore } from "@/store/modal-store";
import { useAuthStore } from "@/store/auth-store";

import { apiClient } from "@/utils/apiClient";

import { IArticle } from "@/types/article.types";

import { LoadingScreen } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Table, TableColumn } from "@/components/tables/Table";
import { useAdminArticleModalStore } from "@/store/admin-article-modal-store";
import { ArticleStatusEnum } from "@/types/articleStatus.types";
import toast from "react-hot-toast";

export default function ManageArticlesPage() {
  const user = useAuthStore((state) => state.user);
  const modal = useModalStore();
  const adminArticleModal = useAdminArticleModalStore();

  const router = useRouter();
  const queryClient = useQueryClient();

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

  const handleManage = async (id: number) => {
    adminArticleModal.show(
      id,
      data?.articles?.find((article) => article.id === id)?.status?.status ||
        "No status",
    );
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await apiClient.fetch(`/articles/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(res);

      if (res.OK) {
        toast.success("Article deleted successfully", {
          position: "top-center",
        });
        queryClient.invalidateQueries({ queryKey: ["articles"] });
      } else {
        toast.error(res.message, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("An unknown error occurred", {
        position: "top-center",
      });
    }
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
            <Button className="" onClick={() => handleManage(article.id)}>
              Manage
            </Button>
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
