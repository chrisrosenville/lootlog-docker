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

  async getCategoryByName(name: string) {
    return await this.categoryRepo.findOne({ where: { name } });
  }

  // async getById(id: number): Promise<Category> {
  //   return await this.categoryRepo.findOne({ where: { id } });
  // }

  // async getByName(name: string): Promise<Category> {
  //   return await this.categoryRepo.findOne({ where: { name } });
  // }

  // async create(category: Partial<Category>): Promise<Category> {
  //   category.name = category.name.toLowerCase();
  //   const newCategory = this.categoryRepo.create(category);
  //   return await this.categoryRepo.save(newCategory);
  // }

  // async update(id: number, updatedCategory: Partial<Category>): Promise<void> {
  //   updatedCategory.name = updatedCategory.name.toLowerCase();
  //   await this.categoryRepo.update(id, updatedCategory);
  // }

  // async delete(id: number): Promise<DeleteResult> {
  //   try {
  //     return await this.categoryRepo.delete(id);
  //   } catch (err) {
  //     console.error(`Error deleting category with id ${id}:`, err);
  //     throw new Error(err);
  //   }
  // }
}
