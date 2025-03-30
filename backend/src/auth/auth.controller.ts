import {
  Controller,
  Post,
  UseGuards,
  Get,
  Res,
  Body,
  HttpStatus,
  ValidationPipe,
  UseFilters,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Response } from "express";
import { CurrentUser } from "./decorators/current-user.decorator";
import { User } from "src/entities/user.entity";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { SignupDto } from "src/users/dto/signup.dto";
import { cookieOptions } from "src/cookieOptions";
import { ValidationExceptionFilter } from "src/lib/validators/auth-exception-filter.validator";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/sign-up")
  @UseFilters(ValidationExceptionFilter)
  async signUp(
    @Body(
      new ValidationPipe({
        exceptionFactory: (errors) => new BadRequestException(errors),
      }),
    )
    body: SignupDto,
    @Res() res: Response,
  ) {
    return this.authService.createUser(body, res);
  }
  @Post("/sign-in")
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUser() user: User, @Res() res: Response) {
    return this.authService.signIn(user, res);
  }

  @Post("/sign-out")
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res: Response) {
    res.clearCookie("session", cookieOptions);
    res.clearCookie("refresh", cookieOptions);
    return res.status(HttpStatus.OK).json({ OK: true, message: "OK" });
  }

  @Get("/whoami")
  @UseGuards(JwtAuthGuard)
  async getUserDetails(@CurrentUser() user: User, res: Response) {
    const userFromDb = await this.authService.getUserDetails(user.id);

    if (!userFromDb) {
      throw new ForbiddenException("User not found");
    }

    return res.status(HttpStatus.OK).json({
      OK: true,
      message: "User retrieved successfully",
      user: userFromDb,
    });
  }

  @Get("/verify")
  @UseGuards(JwtAuthGuard)
  async verifyToken(@CurrentUser() user: User) {
    return true;
  }

  @Get("/refresh")
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(@CurrentUser() user: User, @Res() res: Response) {
    return this.authService.signIn(user, res);
  }
}
