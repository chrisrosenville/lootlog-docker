import { IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import { Image } from "src/entities/image.entity";

export class CreateArticleImageDto extends Image {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsNumber()
  @IsNotEmpty()
  size: number;

  @IsString()
  @IsNotEmpty()
  type: string;
}
