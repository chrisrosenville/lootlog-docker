import { z } from "zod";

import { TCategory } from "@/types/article.types";

import { newCategorySchema } from "@/lib/schemas/categorySchemas";

import { clientFetch } from "..";

export async function getCategories() {
  try {
    const res = await clientFetch(`/categories`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) return (await res.json()) as TCategory[];
    else return null;
  } catch (error) {
    console.error("Error getting user details:", error);
    return null;
  }
}

export async function getCategoryById(id: number) {
  try {
    const res = await clientFetch(`/categories/${id}`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      return (await res.json()) as TCategory;
    }
  } catch (err) {
    console.error("Error getting category:", err);
    return null;
  }
}

export async function createCategory(body: z.infer<typeof newCategorySchema>) {
  try {
    const res = await clientFetch(`/categories`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return res;
  } catch (error) {
    console.error("Error creating category:", error);
    return null;
  }
}

export async function updateCategory(body: TCategory) {
  try {
    const res = await clientFetch(`/categories/${body.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return res;
  } catch (error) {
    console.error("Error updating category:", error);
    return null;
  }
}

export async function deleteCategory(id: number) {
  try {
    const res = await clientFetch(`/categories/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    return res;
  } catch (error) {
    console.error("Error deleting category:", error);
    return null;
  }
}
