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
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";

import { Response } from "express";

import { User } from "src/entities/user.entity";

import { SignupDto } from "src/users/dto/signup.dto";
import { cookieOptions } from "src/cookieOptions";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/sign-up")
  async signUp(
    @Body()
    credentials: {
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
    },
    @Res() res: Response,
  ) {
    return this.authService.signUp(credentials, res);
  }

  @Post("/sign-in")
  async login(
    @Body() credentials: { email: string; password: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.authService.signIn(credentials, req, res);
  }

  @Post("/sign-out")
  async logout(@Res() res: Response) {
    res.clearCookie("refresh_token", cookieOptions);
    return res
      .status(HttpStatus.OK)
      .json({ OK: true, message: "Signed out successfully" });
  }

  // @Get("/whoami")
  // async getUserDetails(res: Response) {
  //   const userFromDb = await this.authService.getUserDetails(user.id);

  //   if (!userFromDb) {
  //     throw new ForbiddenException("User not found");
  //   }

  //   return res.status(HttpStatus.OK).json({
  //     OK: true,
  //     message: "User retrieved successfully",
  //     user: userFromDb,
  //   });
  // }

  // @Get("/verify")
  // async verifyToken(@CurrentUser() user: User) {
  //   return true;
  // }

  // @Get("/refresh")
  // @UseGuards(JwtRefreshAuthGuard)
  // async refreshToken(@CurrentUser() user: User, @Res() res: Response) {
  //   return this.authService.signIn(user, res);
  // }
}
