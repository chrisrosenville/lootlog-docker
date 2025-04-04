import {
  Controller,
  Post,
  Res,
  Body,
  HttpStatus,
  Req,
  Session,
  Get,
} from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";

import { Response } from "express";

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
  async signIn(
    @Body() credentials: { email: string; password: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.authService.signIn(credentials, req, res);
  }

  @Post("/sign-out")
  async signOut(@Req() req: Request, @Res() res: Response) {
    return this.authService.signOut(req, res);
  }

  @Get("/whoami")
  async whoami(@Req() req: Request, @Res() res: Response) {
    return this.authService.whoami(req, res);
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
