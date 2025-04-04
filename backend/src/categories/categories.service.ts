import { HttpStatus, Injectable } from "@nestjs/common";
import { Category } from "src/entities/category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { AuthService } from "src/auth/auth.service";
import { Request, Response } from "express";
import { UsersService } from "src/users/users.service";
@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async getAllCategories(req: Request, res: Response) {
    const user = await this.authService.getCurrentValidatedSessionUser(req);

    if (
      !user ||
      !user.roles.includes("author") ||
      !user.roles.includes("admin")
    ) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "User not authorized to access this resource",
        OK: false,
      });
    }
    const categories = await this.categoryRepo.find();

    return res.status(HttpStatus.OK).json({
      message: "Categories fetched successfully",
      OK: true,
      categories,
    });
  }

  async createCategory(
    body: { categoryName: string },
    req: Request,
    res: Response,
  ) {
    const user = await this.authService.getCurrentValidatedSessionUser(req);

    if (!user || !user.roles.includes("admin")) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "User not authorized to access this resource",
        OK: false,
      });
    }

    const category = this.categoryRepo.create({
      name: body.categoryName,
    });
    await this.categoryRepo.save(category);

    return res.status(HttpStatus.OK).json({
      message: "Category created successfully",
      OK: true,
      category,
    });
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
