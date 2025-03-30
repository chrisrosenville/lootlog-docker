"use server";

import { TArticle } from "@/types/article.types";
import { fetchFromBackend } from "..";

export const getFrontpageArticles = async () => {
  try {
    // Direct connection to backend service endpoint (no /api prefix)
    const response = await fetchFromBackend("/articles/frontpage", {
      method: "GET",
    });

    if (!response.ok) {
      console.error(`Failed with status: ${response.status}`);
      return null;
    }

    // Parse the JSON response
    const articles = await response.json();
    return articles;
  } catch (err) {
    console.log("Error getting other frontpage articles:", err);
    throw new Error("Failed to fetch frontpage articles");
  }
};

export const getArticleById = async (articleId: number) => {
  try {
    const res = await fetchFromBackend(`/articles/${articleId}`, {
      method: "GET",
    });

    if (res.ok) return (await res.json()) as TArticle;

    return null;
  } catch (err) {
    console.log("Error getting article by ID:", err);
    throw new Error("Failed to fetch article by ID");
  }
};

export const getArticlesByCategoryName = async (
  category: string,
  amount: number,
) => {
  try {
    const res = await fetchFromBackend(
      `/articles/category/${category}/${amount}`,
      {
        method: "GET",
      },
    );

    if (res.ok) return (await res.json()) as TArticle[];

    return null;
  } catch (err) {
    console.log("Error getting articles by category:", err);
    throw new Error("Failed to fetch articles by category");
  }
};
