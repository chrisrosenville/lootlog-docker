import { Module } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "src/entities/category.entity";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ArticlesService } from "src/articles/articles.service";

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesService, JwtAuthGuard],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
