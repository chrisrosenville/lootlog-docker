"use client";
import { useState } from "react";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { useModalStore } from "@/store/modal-store";
import { deleteCategory, getCategories } from "@/lib/db/categories";

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

export default function CategoriesPage() {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const modal = useModalStore();

  const handleDeleteCategory = async (id: number) => {
    const res = await deleteCategory(id);
    if (res?.ok) {
      toast.success("The category has been deleted");
      window.location.href = "/dashboard/admin/categories";
      return;
    } else {
      setErrorMessage("Failed to delete the category");
      console.error("Failed to delete the category:", res);
      toast.error(
        <p className="text-neutral-950">
          An error occurred while deleting the category. Please try again later.
        </p>,
      );
      return;
    }
  };

  const onPressDelete = async (id: number) => {
    modal.show(
      "Delete category",
      `Are you sure you want to delete this category?`,
      "Cancel",
      "Delete",
      () => handleDeleteCategory(id),
      "delete",
    );
  };

  if (!categories) return <LoadingScreen />;

  return (
    <div className="flex flex-col">
      <div className="place-self-end pb-4">
        <Link href={"categories/create"}>
          <Button>Create new category</Button>
        </Link>
      </div>
      {errorMessage && (
        <p className="text-center text-red-600">{errorMessage}</p>
      )}
      <Table className="rounded-md bg-neutral-900">
        <TableCaption>All categories</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories &&
            categories.map((category) => (
              <TableRow key={category?.id}>
                <TableCell>{category?.id}</TableCell>
                <TableCell>{category?.name}</TableCell>
                <TableCell className="space-x-2">
                  <Link href={`categories/${category?.id}`}>
                    <Button className="bg-neutral-300 hover:bg-neutral-500">
                      Manage
                    </Button>
                  </Link>
                  <Button
                    className="bg-red-600 text-neutral-100 hover:bg-red-800"
                    onClick={() => onPressDelete(category.id)}
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
