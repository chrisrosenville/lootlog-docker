import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/entities/user.entity";
import { Category } from "src/entities/category.entity";
import { Role } from "src/entities/role.entity";
import { ArticleStatus } from "src/entities/articleStatus.entity";
import { hash } from "src/utils/hash";
import { ArticleStatusEnum } from "src/entities/articleStatus.entity";
@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(ArticleStatus)
    private articleStatusRepo: Repository<ArticleStatus>,
  ) {}

  async seed() {
    await this.seedRoles();
    await this.seedCategories();
    await this.seedUsers();
    await this.seedArticleStatuses();
  }

  private async seedRoles() {
    const roles = ["admin", "user", "author"];

    for (const roleName of roles) {
      const existingRole = await this.roleRepo.findOne({
        where: { name: roleName },
      });
      if (!existingRole) {
        const role = this.roleRepo.create({ name: roleName });
        await this.roleRepo.save(role);
      }
    }
  }

  private async seedCategories() {
    const categories = ["Technology", "Gaming", "Reviews", "News"];

    for (const categoryName of categories) {
      const existingCategory = await this.categoryRepo.findOne({
        where: { name: categoryName.toLowerCase() },
      });
      if (!existingCategory) {
        const category = this.categoryRepo.create({
          name: categoryName.toLowerCase(),
        });
        await this.categoryRepo.save(category);
      }
    }
  }

  private async seedUsers() {
    const adminUser: Partial<User> = {
      userName: process.env.ADMIN_USERNAME,
      firstName: process.env.ADMIN_FIRST_NAME,
      lastName: process.env.ADMIN_LAST_NAME,
      email: process.env.ADMIN_EMAIL,
      password: await hash(process.env.ADMIN_PASSWORD),
      roles: ["admin", "author", "user"],
      isVerified: true,
    };

    const existingAdmin = await this.userRepo.findOne({
      where: { email: adminUser.email },
    });

    if (!existingAdmin) {
      const user = this.userRepo.create(adminUser);
      await this.userRepo.save(user);
    }
  }

  private async seedArticleStatuses() {
    const statuses: ArticleStatusEnum[] = [
      ArticleStatusEnum.DRAFT,
      ArticleStatusEnum.PUBLISHED,
      ArticleStatusEnum.ARCHIVED,
      ArticleStatusEnum.REJECTED,
      ArticleStatusEnum.PENDING,
    ];

    for (const status of statuses) {
      const existingStatus = await this.articleStatusRepo.findOne({
        where: { status },
      });
      if (!existingStatus) {
        const articleStatus = this.articleStatusRepo.create({ status });
        await this.articleStatusRepo.save(articleStatus);
      }
    }
  }
}
