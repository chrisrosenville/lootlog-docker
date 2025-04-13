import { Module } from "@nestjs/common";
import { ArticleStatusesController } from "./article-statuses.controller";
import { ArticleStatusesService } from "./article-statuses.service";
import { ArticleStatus } from "src/entities/articleStatus.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ArticleStatus])],
  controllers: [ArticleStatusesController],
  providers: [ArticleStatusesService],
  exports: [ArticleStatusesService],
})
export class ArticleStatusesModule {}
