import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Response } from "express";
import { Repository } from "typeorm";

import { Category } from "src/entities/category.entity";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async getCategoryByName(name: string) {
    return await this.categoryRepo.findOne({ where: { name } });
  }

  async getAllCategories(res: Response) {
    const categories = await this.categoryRepo.find();

    return res.status(HttpStatus.OK).json({
      message: "Categories fetched successfully",
      OK: true,
      categories,
    });
  }

  async createCategory(body: { categoryName: string }, res: Response) {
    const category = this.categoryRepo.create({
      name: body.categoryName,
    });
    console.log("New category:", category);
    await this.categoryRepo.save(category);

    return res.status(HttpStatus.OK).json({
      message: "Category created successfully",
      OK: true,
      category,
    });
  }

  async updateCategory(
    id: number,
    body: { categoryName: string },
    res: Response,
  ) {
    const category = await this.categoryRepo.findOne({
      where: { id },
    });
    if (!category) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Category not found",
        OK: false,
      });
    }

    category.name = body.categoryName;
    await this.categoryRepo.save(category);

    return res.status(HttpStatus.OK).json({
      message: "Category updated successfully",
      OK: true,
      category,
    });
  }

  async deleteCategory(id: number, res: Response) {
    const category = await this.categoryRepo.findOne({
      where: { id },
    });
    if (!category) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Category not found",
        OK: false,
      });
    }

    await this.categoryRepo.remove(category);

    return res.status(HttpStatus.OK).json({
      message: "Category deleted successfully",
      OK: true,
    });
  }
}
