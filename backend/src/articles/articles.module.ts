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
import { VideosModule } from "src/videos/videos.module";
import { AuthModule } from "src/auth/auth.module";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    MulterModule.register({}),
    AuthModule,
    CategoriesModule,
    UsersModule,
    ImagesModule,
    VideosModule,
  ],
  providers: [ArticlesService],
  controllers: [ArticlesController],
  exports: [ArticlesService],
})
export class ArticlesModule {}
