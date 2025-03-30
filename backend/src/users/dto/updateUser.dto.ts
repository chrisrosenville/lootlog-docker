import { IsBoolean, IsEmail, IsString } from "class-validator";
import { User } from "src/entities/user.entity";

export class UpdateUserDto extends User {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  isVerified: boolean;

  @IsBoolean()
  isAuthor: boolean;

  @IsBoolean()
  isAdmin: boolean;
}
