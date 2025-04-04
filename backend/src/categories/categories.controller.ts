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
  Req,
  Res,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { User } from "src/entities/user.entity";
import { Category } from "src/entities/category.entity";
import { Request, Response } from "express";

@Controller("/categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get("/all")
  async getAllCategories(@Req() req: Request, @Res() res: Response) {
    return await this.categoriesService.getAllCategories(req, res);
  }

  @Post("/create")
  async createCategory(
    @Body() body: { categoryName: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.categoriesService.createCategory(body, req, res);
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
