import { IArticle } from "./article.types";
import { TUserRoles } from "./roles.types";

export interface IUser {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: TUserRoles[];
  isVerified: boolean;
  likedArticles: string[];
  articles: IArticle[];
}
