import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Res,
  Put,
  Delete,
  Param,
} from "@nestjs/common";
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

  @Put("/:id")
  @UseGuards(AdminGuard)
  async updateCategory(
    @Param("id") id: string,
    @Body() body: { categoryName: string },
    @Res() res: Response,
  ) {
    return await this.categoriesService.updateCategory(parseInt(id), body, res);
  }

  @Delete("/:id")
  @UseGuards(AdminGuard)
  async deleteCategory(@Param("id") id: string, @Res() res: Response) {
    console.log("Deleting category with id:", id);
    return await this.categoriesService.deleteCategory(parseInt(id), res);
  }
}
