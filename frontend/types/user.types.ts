import { TArticle } from "./article.types";

export type TUser = {
  id: number;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  isAuthor: boolean;
  isAdmin: boolean;
  articles?: TArticle[] | null;
};
