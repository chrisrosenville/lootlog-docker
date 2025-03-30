import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsString,
  MaxLength,
} from "class-validator";

import { Video } from "src/entities/video.entity";

export class UpdateArticleDto {
  @IsNumber()
  id: number;

  @IsString({ message: "Title must be a string" })
  @MaxLength(100, {
    message: "The title cannot contain more than 100 characters",
  })
  title: string;

  @IsString({ message: "The category name must be a string" })
  categoryName: string;

  @IsObject({ message: "Image must be an object" })
  imageAsFile?: Express.MulterFile;

  @IsString({ message: "The article body must be a string" })
  body: string;

  @IsObject({ message: "The Youtube video must be an object" })
  video?: Video;

  @IsString({ message: "The public status must be a string" })
  public_status: string;

  @IsBoolean()
  feature_status: boolean;
}
