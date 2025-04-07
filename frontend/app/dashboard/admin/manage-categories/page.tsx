"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { useModalStore } from "@/store/modal-store";
import { useAuthStore } from "@/store/auth-store";

import { ICategory } from "@/types/category.types";

import { apiClient } from "@/utils/apiClient";

import { LoadingScreen } from "@/components/ui/loading";
import { Table, TableColumn } from "@/components/tables/Table";
import { Button } from "@/components/ui/button";

export default function CategoriesPage() {
  const user = useAuthStore((state) => state.user);
  const modal = useModalStore();

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      if (user) {
        return await apiClient.fetch("/categories", {
          method: "GET",
        });
      }
    },
  });

  const handleDelete = async (id: number) => {
    console.log(id);
  };

  const onPressDelete = async (id: number) => {
    modal.show(
      "Delete category",
      `Are you sure you want to delete this category?`,
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

  const columns: TableColumn<ICategory>[] = [
    {
      key: "name",
      header: "Name",
    },
    {
      key: "actions",
      header: "",
      render: (category) => (
        <div className="flex justify-end space-x-2">
          <Link href={`categories/${category.id}`}>
            <Button className="">Manage</Button>
          </Link>
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => onPressDelete(category.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (!data?.categories) return <LoadingScreen />;

  return (
    <div className="flex flex-col">
      <div className="place-self-end pb-4">
        <Link href={"manage-categories/create"}>
          <Button>Create new category</Button>
        </Link>
      </div>
      <Table
        data={data?.categories}
        columns={columns}
        caption="All categories"
        className="rounded-md bg-neutral-900"
      />
    </div>
  );
}
