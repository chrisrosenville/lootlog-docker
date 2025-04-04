import { IArticle } from "./article.types";

export interface IImage {
  id: number;
  name: string;
  url: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  article: IArticle;
}
