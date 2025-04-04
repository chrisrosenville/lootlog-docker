"use client";
import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { useModalStore } from "@/store/modal-store";

import {
  getAllArticles,
  toggleArticleFeatureStatus,
  toggleArticlePublicStatus,
} from "@/lib/db/articles";
import { deleteArticle } from "@/lib/db/articles";

import { LoadingScreen } from "@/components/ui/loading";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { apiClient } from "@/utils/apiClient";
import { TArticle } from "@/types/article.types";

export default function ManageArticlesPage() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const modal = useModalStore();

  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const res = await apiClient.fetch("/articles");
      return res.articles;
    },
  });

  const handleDeleteArticle = async (id: number) => {
    const res = await deleteArticle(id);
    if (res?.ok) {
      toast.success("The article has been deleted");
      router.refresh();
      return;
    } else {
      setErrorMessage("Failed to delete the article");
      console.error("Failed to delete the article:", res);
      toast.error(
        <p className="text-neutral-950">
          An error occurred while deleting the article. Please try again later.
        </p>,
      );
      return;
    }
  };

  const handleTogglePublicStatus = async (id: number, isPublic: boolean) => {
    const res = await toggleArticlePublicStatus(id);
    if (res?.ok) {
      toast.success(
        isPublic ? "The article has been hidden" : "The article has been shown",
      );
      router.refresh();
      return;
    }
  };

  const handleToggleFeatureStatus = async (id: number, isFeatured: boolean) => {
    const res = await toggleArticleFeatureStatus(id);
    if (res?.ok) {
      toast.success(
        isFeatured
          ? "The article has been removed from the featured list"
          : "The article has been added to the featured list",
      );
      window.location.reload();
      return;
    }
  };

  const onPressDelete = async (id: number) => {
    modal.show(
      "Delete article",
      `Are you sure you want to delete this article?`,
      "Cancel",
      "Delete",
      () => handleDeleteArticle(id),
      "delete",
    );
  };

  const onTogglePublish = async (id: number, isPublic: boolean) => {
    modal.show(
      "Change public status",
      isPublic
        ? `Are you sure you want to hide this article on the website?`
        : `Are you sure you want to show this article on the website?`,
      "Cancel",
      isPublic ? "Hide" : "Publish",
      () => handleTogglePublicStatus(id, isPublic),
      "primary",
    );
  };

  const onToggleFeature = async (id: number, isFeatured: boolean) => {
    modal.show(
      "Change featured status",
      isFeatured
        ? `Are you sure you want to remove this article from the featured list?`
        : `Are you sure you want to add this article to the featured list?`,
      "Cancel",
      isFeatured ? "Remove" : "Add",
      () => handleToggleFeatureStatus(id, isFeatured),
      "primary",
    );
  };

  if (!data.articles || isLoading) return <LoadingScreen />;

  return (
    <div>
      {errorMessage && (
        <p className="text-center text-red-600">{errorMessage}</p>
      )}
      <Table className="rounded-md bg-neutral-900">
        <TableCaption>All articles</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Public</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.articles &&
            data.articles.map((article: TArticle) => (
              <TableRow key={article?.id}>
                <TableCell>{article?.id}</TableCell>
                <TableCell>{article?.title}</TableCell>
                <TableCell style={{ textTransform: "capitalize" }}>
                  {article?.category?.name}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={article?.isPublic}
                    onCheckedChange={() =>
                      onTogglePublish(article.id, article.isPublic)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={article?.isFeatured}
                    onCheckedChange={() =>
                      onToggleFeature(article.id, article.isFeatured)
                    }
                  />
                </TableCell>
                <TableCell className="space-x-2">
                  <Link href={`articles/${article?.id}`}>
                    <Button className="bg-neutral-300 hover:bg-neutral-500">
                      Manage
                    </Button>
                  </Link>
                  <Button
                    className="bg-red-600 text-neutral-100 hover:bg-red-800"
                    onClick={() => onPressDelete(article.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
