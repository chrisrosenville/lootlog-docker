import { IArticle } from "./article.types";

export interface ICategory {
  id: number;
  name: string;
  articles: IArticle[];
}
