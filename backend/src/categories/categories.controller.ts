import { Controller, UseGuards, Get, Post, Body, Res } from "@nestjs/common";
import { Response } from "express";

import { CategoriesService } from "./categories.service";

import { AdminGuard } from "src/guards/AdminGuard";
import { AuthorGuard } from "src/guards/AuthorGuard";

@Controller("/categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @UseGuards(AuthorGuard)
  async getAllCategories(@Res() res: Response) {
    return await this.categoriesService.getAllCategories(res);
  }

  @Post()
  @UseGuards(AdminGuard)
  async createCategory(
    @Body() body: { categoryName: string },
    @Res() res: Response,
  ) {
    console.log("Creating category:", body);
    return await this.categoriesService.createCategory(body, res);
  }

  // @Get("/:id")
  // @UseGuards(JwtAuthGuard)
  // async getCategoryById(@Param("id") id: string) {
  //   return this.categoriesService.getById(parseInt(id));
  // }

  // @Post()
  // @UseGuards(JwtAuthGuard)
  // async createCategory(
  //   @CurrentUser() user: User,
  //   @Body() body: Partial<Category>,
  // ): Promise<Category> {
  //   if (user.roles.includes("admin")) {
  //     return this.categoriesService.create(body);
  //   }

  //   throw new UnauthorizedException();
  // }

  // @Patch("/:id")
  // @UseGuards(JwtAuthGuard)
  // async updateCategory(
  //   @Param("id") id: string,
  //   @CurrentUser() user: User,
  //   @Body() updatedCategory: Partial<Category>,
  // ): Promise<Category> {
  //   if (user.roles.includes("admin")) {
  //     await this.categoriesService.update(parseInt(id), updatedCategory);
  //     return this.categoriesService.getById(parseInt(id));
  //   }

  //   throw new UnauthorizedException();
  // }

  // @Delete("/:id")
  // @UseGuards(JwtAuthGuard)
  // async deleteCategory(@Param("id") id: string, @CurrentUser() user: User) {
  //   if (user.roles.includes("admin")) {
  //     await this.categoriesService.delete(parseInt(id));
  //     return { message: "Category deleted successfully" };
  //   }

  //   throw new UnauthorizedException();
  // }
}
