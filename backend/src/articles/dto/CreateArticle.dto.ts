import { IsString, IsOptional, MaxLength, IsUrl } from "class-validator";

export class CreateArticleDto {
  @IsString({ message: "Title must be a string" })
  @MaxLength(100, {
    message: "The title cannot contain more than 100 characters",
  })
  title: string;

  @IsString({ message: "Body must be a string" })
  body: string;

  @IsString({ message: "Category name must be a string" })
  categoryName: string;

  image?: Express.Multer.File;

  @IsOptional()
  @IsUrl({}, { message: "Invalid YouTube URL format" })
  videoUrl?: string;

  @IsOptional()
  @IsString({ message: "Public status must be a string" })
  public_status?: string = "draft";

  @IsOptional()
  feature_status?: boolean = false;
}
