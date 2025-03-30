"use server";

import { serverFetch } from "..";

export const getFrontpageArticles = async () => {
  try {
    const response = await serverFetch("/articles/frontpage", {
      method: "GET",
    });

    return await response.json();
  } catch (err) {
    console.log("Error getting other frontpage articles:", err);
    throw new Error("Failed to fetch frontpage articles");
  }
};

export const getArticleById = async (articleId: number) => {
  try {
    const response = await serverFetch(`/articles/${articleId}`, {
      method: "GET",
    });

    return await response.json();
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
    const response = await serverFetch(
      `/articles/category/${category}/${amount}`,
      {
        method: "GET",
      },
    );

    return await response.json();
  } catch (err) {
    console.log("Error getting articles by category:", err);
    throw new Error("Failed to fetch articles by category");
  }
};
