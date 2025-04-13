import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class SignupDto {
  @IsString()
  @MinLength(3, { message: "Username must be at least 3 characters long" })
  userName: string;

  @IsString()
  @MinLength(2, { message: "First names must be at least 2 characters long" })
  @MaxLength(50, {
    message: "First names must not be longer than 50 characters",
  })
  firstName: string;

  @IsString()
  @MinLength(2, { message: "Last names must be at least 2 characters long" })
  @MaxLength(50, {
    message: "Last names must not be longer than 50 characters",
  })
  lastName: string;

  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
    },
  )
  password: string;

  @IsString()
  repeatPassword: string;
}
