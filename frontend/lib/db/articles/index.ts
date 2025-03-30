import { z } from "zod";
import { TArticle } from "@/types/article.types";

import { convertCanvasToBlob, resizeImage } from "@/lib/image";
import {
  existingArticleSchema,
  newArticleSchema,
} from "@/lib/schemas/articleSchemas";

import { clientFetch } from "..";

export const getAllArticles = async () => {
  try {
    const res = await clientFetch(`/articles`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) return (await res.json()) as TArticle[];
    else return null;
  } catch (error) {
    console.error("Error getting articles:", error);
    return null;
  }
};

export const getArticlesByUser = async () => {
  try {
    const res = await clientFetch(`/articles/user`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) return (await res.json()) as TArticle[];
    else return null;
  } catch (error) {
    console.error("Error getting articles:", error);
    return null;
  }
};

// TODO: finish using both userid and articleid
export const getArticleByUser = async (userId: number, articleId: number) => {
  try {
    const res = await clientFetch(`/articles/user/${articleId}`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) return (await res.json()) as TArticle[];
    else return null;
  } catch (error) {
    console.error("Error getting articles:", error);
    return null;
  }
};

export const getArticleById = async (articleId: string) => {
  try {
    const res = await clientFetch(`/articles/${articleId}`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) return (await res.json()) as TArticle;
    else return null;
  } catch (error) {
    console.error("Error getting articles:", error);
    return null;
  }
};

export const getUserArticleById = async (articleId: string) => {
  try {
    const res = await clientFetch(`/articles/user/${articleId}`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) return await res.json();
    else return null;
  } catch (error) {
    console.error("Error getting articles:", error);
    return null;
  }
};

const newArticleValuesToFormData = async (
  data: z.infer<typeof newArticleSchema>,
) => {
  try {
    const formData = new FormData();
    const imageFile = data.image[0];

    const canvas = await resizeImage(data.image[0]);
    if (canvas) {
      const blob = await convertCanvasToBlob(
        canvas,
        imageFile.type,
        imageFile.name,
      );
      if (blob) formData.append("image", blob);
    }

    formData.append("title", data.title);
    formData.append("body", data.body);
    formData.append("categoryName", data.categoryName);

    return formData;
  } catch (error) {
    console.error("Error converting new article to form data:", error);
    return null;
  }
};

export const createArticle = async (data: any) => {
  try {
    const formData = await newArticleValuesToFormData(data);

    const res = await clientFetch(`/articles`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    return res;
  } catch (err) {
    console.error("Error creating article:", err);
    throw err;
  }
};

const updateArticleValuesToFormData = async (
  article: z.infer<typeof existingArticleSchema>,
  // oldArticle: TArticle,
) => {
  try {
    const formData = new FormData();
    const imageFile = article.image;

    // If the image object doesn't have an ID, a new image has been chosen.
    if (!imageFile.id) {
      const canvas = await resizeImage(imageFile);
      if (canvas) {
        const blob = await convertCanvasToBlob(
          canvas,
          imageFile.type,
          imageFile.name,
        );
        if (blob) formData.append("image", blob);
      }
    }

    formData.append("title", article.title);
    formData.append("body", article.body);
    formData.append("categoryName", article.categoryName);

    return formData;
  } catch (error) {
    console.error("Error converting new article to form data:", error);
    return null;
  }
};

export const updateArticle = async (
  updatedArticle: z.infer<typeof existingArticleSchema>,
) => {
  try {
    const formData = await updateArticleValuesToFormData(updatedArticle);

    const res = await clientFetch(`/articles/${updatedArticle.id}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });

    return res;
  } catch (err) {
    console.error("Error creating article:", err);
    throw err;
  }
};

export const deleteArticle = async (articleId: number) => {
  try {
    const res = await clientFetch(`/articles/${articleId}`, {
      method: "DELETE",
      credentials: "include",
    });

    return res;
  } catch (err) {
    console.error("Error deleting article:", err);
    return null;
  }
};

export const toggleArticlePublicStatus = async (articleId: number) => {
  try {
    const res = await clientFetch(`/articles/${articleId}/toggle-public`, {
      method: "POST",
      credentials: "include",
    });

    return res;
  } catch (err) {
    console.error("Error toggling public status:", err);
    return null;
  }
};

export const toggleArticleFeatureStatus = async (articleId: number) => {
  try {
    const res = await clientFetch(`/articles/${articleId}/toggle-featured`, {
      method: "POST",
      credentials: "include",
    });

    return res;
  } catch (err) {
    console.error("Error toggling featured status:", err);
    return null;
  }
};
