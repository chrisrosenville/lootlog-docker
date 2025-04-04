"use client";
import { useState } from "react";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { useModalStore } from "@/store/modal-store";

import { LoadingScreen } from "@/components/ui/loading";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/utils/apiClient";
import { useAuthStore } from "@/store/auth-store";
import { Table, TableColumn } from "@/components/tables/Table";
import { ICategory } from "@/types/category.types";
export default function CategoriesPage() {
  const user = useAuthStore((state) => state.user);

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      if (user) {
        const res = await apiClient.fetch("/categories/all", {
          method: "GET",
        });
        console.log(res);
        return res;
      }
    },
  });

  const modal = useModalStore();

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
