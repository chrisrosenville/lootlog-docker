"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getCategoryById } from "@/lib/db/categories";

import { CategoryForm } from "@/components/forms/CategoryForm";
import { LoadingScreen } from "@/components/ui/loading";

export default function EditCategoryPage() {
  const params: { id: string } = useParams();

  const { data: category } = useQuery({
    queryKey: ["category", params.id],
    queryFn: async () => await getCategoryById(parseInt(params.id)),
  });

  if (!category?.id) return <LoadingScreen />;

  return <CategoryForm existingCategory={category} />;
}
