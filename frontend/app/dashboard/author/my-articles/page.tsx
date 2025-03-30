"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { deleteArticle, getArticlesByUser } from "@/lib/db/articles";

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
import { useModalStore } from "@/store/modal-store";
import { useState } from "react";
import { toast } from "sonner";

export default function MyArticlesPage() {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { data: articles } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticlesByUser,
  });

  const modal = useModalStore();

  const handleDeleteArticle = async (id: number) => {
    const res = await deleteArticle(id);
    if (res?.ok) {
      toast.success("The article has been deleted");
      window.location.href = "/dashboard/author/my-articles";
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

  if (!articles) return <LoadingScreen />;

  return (
    <div>
      {errorMessage && (
        <p className="text-center text-red-600">{errorMessage}</p>
      )}
      <Table className="rounded-md bg-neutral-900">
        <TableCaption>My articles</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles &&
            articles.map((article) => (
              <TableRow key={article?.id}>
                <TableCell>{article?.id}</TableCell>
                <TableCell>{article?.title}</TableCell>
                <TableCell style={{ textTransform: "capitalize" }}>
                  {article?.category?.name}
                </TableCell>
                <TableCell className="space-x-2">
                  <Link href={`my-articles/${article?.id}`}>
                    <Button className="bg-neutral-300 hover:bg-neutral-500">
                      Manage
                    </Button>
                  </Link>
                  {/* <Button
                    className="bg-red-600 text-neutral-100 hover:bg-red-800"
                    onClick={() => onPressDelete(article.id)}
                  >
                    Delete
                  </Button> */}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
