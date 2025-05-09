import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { TypeOrmModule } from "./typeorm/typeorm.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { CategoriesModule } from "./categories/categories.module";
import { ArticlesModule } from "./articles/articles.module";
import { ImagesModule } from "./images/images.module";
import { ConfigModule } from "@nestjs/config";
import { VideosController } from "./videos/videos.controller";
import { VideosModule } from "./videos/videos.module";
import { SeederModule } from "./database/seeders/seeder.module";
import { ArticleStatusesModule } from './article-statuses/article-statuses.module';
@Module({
  imports: [
    PassportModule.register({ session: true }),
    TypeOrmModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    ArticlesModule,
    ImagesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    VideosModule,
    SeederModule,
    ArticleStatusesModule,
  ],
  controllers: [AppController, VideosController],
  providers: [AppService],
})
export class AppModule {}
