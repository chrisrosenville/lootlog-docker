import { IsNumber, IsObject, IsString, MaxLength } from "class-validator";
import { Article } from "src/entities/article.entity";
import { CreateArticleImageDto } from "src/images/dto/CreateArticleImage.dto";

export class CreateArticleDto extends Article {
  @IsString({ message: "Title must be a string" })
  @MaxLength(100, {
    message: "The title cannot contain more than 100 characters",
  })
  title: string;

  @IsString({ message: "The category name must be a string" })
  categoryName: string;

  @IsObject({ message: "Image must be an object" })
  imageAsFile?: Express.MulterFile;

  @IsObject({ message: "Video must be an object" })
  videoAsFile?: Express.MulterFile;

  @IsString({ message: "The article body must be a string" })
  body: string;

  @IsString({ message: "The Youtube video ID must be a string" })
  videoId?: string;
}
