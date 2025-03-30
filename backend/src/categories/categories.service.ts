import { Injectable } from "@nestjs/common";
import { Category } from "src/entities/category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async getAll(): Promise<Category[]> {
    return await this.categoryRepo.find();
  }

  async getById(id: number): Promise<Category> {
    return await this.categoryRepo.findOne({ where: { id } });
  }

  async getByName(name: string): Promise<Category> {
    return await this.categoryRepo.findOne({ where: { name } });
  }

  async create(category: Partial<Category>): Promise<Category> {
    category.name = category.name.toLowerCase();
    const newCategory = this.categoryRepo.create(category);
    return await this.categoryRepo.save(newCategory);
  }

  async update(id: number, updatedCategory: Partial<Category>): Promise<void> {
    updatedCategory.name = updatedCategory.name.toLowerCase();
    await this.categoryRepo.update(id, updatedCategory);
  }

  async delete(id: number): Promise<DeleteResult> {
    try {
      return await this.categoryRepo.delete(id);
    } catch (err) {
      console.error(`Error deleting category with id ${id}:`, err);
      throw new Error(err);
    }
  }
}
