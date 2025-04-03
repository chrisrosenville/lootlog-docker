import { Response } from "express";
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Res,
  Session,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";

import { extractSafeUserInfo } from "src/utils/extractSafeUserInfo";

@Controller("/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/:id")
  async getUser(
    @Session() session: Record<string, any>,
    @Param("id") id: string,
    @Res() res: Response,
  ) {
    if (!session.user) {
      throw new UnauthorizedException();
    }

    if (
      session.user.id !== parseInt(id) ||
      !session.user.roles.includes("admin")
    ) {
      throw new ForbiddenException();
    }

    const user = await this.usersService.getUserById(parseInt(id));
    if (!user) {
      throw new NotFoundException();
    }

    const safeUser = extractSafeUserInfo(user);

    return res.status(HttpStatus.OK).json({
      OK: true,
      message: "User fetched successfully",
      user: safeUser,
    });
  }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // async getAllUsers(@CurrentUser() user: User) {
  //   if (user.roles.includes("admin")) {
  //     return this.usersService.getAllUsers();
  //   } else throw new ForbiddenException();
  // }

  // @Get("/whoami")
  // @UseGuards(JwtAuthGuard)
  // async getCurrentUser(@CurrentUser() user: User) {
  //   const userFromDb = await this.usersService.findUserById(user.id);
  //   const { password, refreshToken, ...rest } = userFromDb;
  //   return rest;
  // }

  // @Get("/is-admin")
  // @UseGuards(JwtAuthGuard)
  // async getUserRole(@CurrentUser() user: User) {
  //   if (user.roles.includes("admin")) return true;
  //   else return false;
  // }

  // @Get("/:id")
  // @UseGuards(JwtAuthGuard)
  // async getUserById(@Param("id") userId: number, @CurrentUser() user: User) {
  //   if (user.roles.includes("admin")) {
  //     const userFromDb = await this.usersService.findUserById(userId);
  //     const { password, refreshToken, ...rest } = userFromDb;
  //     return rest;
  //   } else throw new ForbiddenException();
  // }

  // @Patch("/:id")
  // @UseGuards(JwtAuthGuard)
  // async updateUser(
  //   @Param("id") userId: string,
  //   @CurrentUser() user: User,
  //   @Body() updatedUser: Partial<UpdateUserDto>,
  // ) {
  //   if (user.roles.includes("admin") || user.id === parseInt(userId)) {
  //     console.log("From body:", updatedUser);
  //     return this.usersService.updateUser(parseInt(userId), updatedUser);
  //   }

  //   throw new ForbiddenException();
  // }

  // @Delete("/:id")
  // @UseGuards(JwtAuthGuard)
  // async deleteUser(@Param("id") userId: string, @CurrentUser() user: User) {
  //   if (user.roles.includes("admin") || user.id === parseInt(userId)) {
  //     return this.usersService.deleteUser(parseInt(userId));
  //   }

  //   throw new ForbiddenException();
  // }
}
