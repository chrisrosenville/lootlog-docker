import { create } from "zustand";
import { ArticleStatusEnum } from "@/types/articleStatus.types";

interface AdminModalState {
  articleId: number | null;
  currentStatus: ArticleStatusEnum | null;
  isVisible: boolean;

  // Actions
  show: (articleId: number, currentStatus: ArticleStatusEnum) => void;
  dismiss: () => void;
}

export const useAdminArticleModalStore = create<AdminModalState>((set) => ({
  articleId: null,
  currentStatus: null,
  isVisible: false,

  show: (articleId: number, currentStatus: ArticleStatusEnum | string) =>
    set((state) => ({
      ...state,
      articleId,
      currentStatus: currentStatus as ArticleStatusEnum,
      isVisible: true,
    })),

  dismiss: () =>
    set((state) => ({
      ...state,
      articleId: null,
      currentStatus: null,
      isVisible: false,
    })),
}));
