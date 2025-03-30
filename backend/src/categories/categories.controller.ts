import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  UnauthorizedException,
  Patch,
  Delete,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "src/entities/user.entity";
import { Category } from "src/entities/category.entity";

@Controller("/categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories() {
    return await this.categoriesService.getAll();
  }

  @Get("/:id")
  @UseGuards(JwtAuthGuard)
  async getCategoryById(@Param("id") id: string) {
    return this.categoriesService.getById(parseInt(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createCategory(
    @CurrentUser() user: User,
    @Body() body: Partial<Category>,
  ): Promise<Category> {
    if (user.role === "admin") {
      return this.categoriesService.create(body);
    }

    throw new UnauthorizedException();
  }

  @Patch("/:id")
  @UseGuards(JwtAuthGuard)
  async updateCategory(
    @Param("id") id: string,
    @CurrentUser() user: User,
    @Body() updatedCategory: Partial<Category>,
  ): Promise<Category> {
    if (user.role === "admin") {
      await this.categoriesService.update(parseInt(id), updatedCategory);
      return this.categoriesService.getById(parseInt(id));
    }

    throw new UnauthorizedException();
  }

  @Delete("/:id")
  @UseGuards(JwtAuthGuard)
  async deleteCategory(@Param("id") id: string, @CurrentUser() user: User) {
    if (user.role === "admin") {
      await this.categoriesService.delete(parseInt(id));
      return { message: "Category deleted successfully" };
    }

    throw new UnauthorizedException();
  }
}
