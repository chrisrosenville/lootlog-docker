import { Request, Response } from "express";
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  Req,
  Res,
  Session,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";

import { UpdateUserDto } from "./dto/updateUser.dto";
import { AdminGuard } from "src/guards/AdminGuard";
import { SessionGuard } from "src/guards/SessionGuard";
@Controller("/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AdminGuard)
  async getAllUsers(@Res() res: Response) {
    return this.usersService.getAllUsers(res);
  }

  @Get("/admin/:id")
  @UseGuards(AdminGuard)
  async getUserAsAdmin(
    @Param("id") id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.usersService.getUser(parseInt(id), res);
  }

  @Put("/admin/:id")
  @UseGuards(AdminGuard)
  async updateUserAsAdmin(
    @Param("id") id: string,
    @Body() user: UpdateUserDto,
    @Res() res: Response,
  ) {
    return this.usersService.updateUser(parseInt(id), user, res);
  }

  @Get("/:id")
  @UseGuards(SessionGuard)
  async getUserAsUser(@Req() req: Request, @Res() res: Response) {
    if (req.session.user.userId !== parseInt(req.params.id)) {
      throw new ForbiddenException();
    }

    return this.usersService.getUser(req.session.user.userId, res);
  }

  @Put("/:id")
  @UseGuards(SessionGuard)
  async updateUserAsUser(
    @Param("id") id: string,
    @Body() user: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (req.session.user.userId !== parseInt(req.params.id)) {
      throw new ForbiddenException();
    }

    return this.usersService.updateUser(parseInt(id), user, res);
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
