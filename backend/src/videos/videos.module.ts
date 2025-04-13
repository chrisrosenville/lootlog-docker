import { Module } from "@nestjs/common";
import { VideosService } from "./videos.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Video } from "src/entities/video.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Video])],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}
