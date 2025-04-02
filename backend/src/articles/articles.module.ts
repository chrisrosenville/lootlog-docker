import { Module } from "@nestjs/common";
import { ArticlesService } from "./articles.service";
import { ArticlesController } from "./articles.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Article } from "src/entities/article.entity";
import { CategoriesModule } from "src/categories/categories.module";
import { CategoriesService } from "src/categories/categories.service";
import { UsersModule } from "src/users/users.module";
import { UsersService } from "src/users/users.service";
import { ImagesModule } from "src/images/images.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    CategoriesModule,
    UsersModule,
    ImagesModule,
  ],
  providers: [ArticlesService],
  controllers: [ArticlesController],
  exports: [ArticlesService],
})
export class ArticlesModule {}
