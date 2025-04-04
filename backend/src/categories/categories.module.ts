import { Module } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "src/entities/category.entity";
import { AuthModule } from "src/auth/auth.module";
import { UsersModule } from "src/users/users.module";
@Module({
  imports: [TypeOrmModule.forFeature([Category]), AuthModule, UsersModule],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
