import { IArticleStatus } from "./articleStatus.types";
import { ICategory } from "./category.types";
import { IImage } from "./image.types";
import { IUser } from "./user.types";
import { IVideo } from "./video.types";

export interface IArticle {
  id: number;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  status: IArticleStatus;
  image: IImage;
  video: IVideo;
  author: IUser;
  category: ICategory;
}
