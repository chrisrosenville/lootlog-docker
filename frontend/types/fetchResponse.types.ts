import { IUser } from "./user.types";
import { IArticle } from "./article.types";
import { ICategory } from "./category.types";
import { IImage } from "./image.types";
import { IVideo } from "./video.types";

export interface IResponseFormat {
  OK: boolean;
  message: string;
  user?: IUser | null;
  users?: IUser[] | null;
  article?: IArticle | null;
  articles?: IArticle[] | null;
  categories?: ICategory[] | null;
  category?: ICategory | null;
  image?: IImage | null;
  images?: IImage[] | null;
  video?: IVideo | null;
  videos?: IVideo[] | null;
}
