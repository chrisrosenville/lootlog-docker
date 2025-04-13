import { IArticle } from "./article.types";

export interface IVideo {
  id: number;
  name: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  article: IArticle;
}
