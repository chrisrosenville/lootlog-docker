export enum ArticleStatusEnum {
  DRAFT = "draft",
  PENDING = "pending",
  REJECTED = "rejected",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export interface IArticleStatus {
  id: number;
  status: ArticleStatusEnum;
}
