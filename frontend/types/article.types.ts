import { ICategory } from "./category.types";
import { IImage } from "./image.types";
import { IUser } from "./user.types";
import { IVideo } from "./video.types";
import { ArticleStatus } from "./articleStatus.types";

export interface IArticle {
  id: number;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  status: ArticleStatus;
  image: IImage;
  video: IVideo;
  author: IUser;
  category: ICategory;
}
