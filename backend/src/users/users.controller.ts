import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "src/entities/user.entity";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UpdateUserDto } from "./dto/updateUser.dto";

@Controller("/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@CurrentUser() user: User) {
    if (user.role === "admin") {
      return this.usersService.getAllUsers();
    } else throw new ForbiddenException();
  }

  @Get("/whoami")
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: User) {
    const userFromDb = await this.usersService.findUserById(user.id);
    const { password, refreshToken, ...rest } = userFromDb;
    return rest;
  }

  @Get("/is-admin")
  @UseGuards(JwtAuthGuard)
  async getUserRole(@CurrentUser() user: User) {
    if (user.role === "admin") return true;
    else return false;
  }

  @Get("/:id")
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param("id") userId: number, @CurrentUser() user: User) {
    if (user.role === "admin") {
      const userFromDb = await this.usersService.findUserById(userId);
      const { password, refreshToken, ...rest } = userFromDb;
      return rest;
    } else throw new ForbiddenException();
  }

  @Patch("/:id")
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param("id") userId: string,
    @CurrentUser() user: User,
    @Body() updatedUser: Partial<UpdateUserDto>,
  ) {
    if (user.role === "admin" || user.id === parseInt(userId)) {
      console.log("From body:", updatedUser);
      return this.usersService.updateUser(parseInt(userId), updatedUser);
    }

    throw new ForbiddenException();
  }

  @Delete("/:id")
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param("id") userId: string, @CurrentUser() user: User) {
    if (user.role === "admin" || user.id === parseInt(userId)) {
      return this.usersService.deleteUser(parseInt(userId));
    }
  }
}
