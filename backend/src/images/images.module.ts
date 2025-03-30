import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ImagesController } from "./images.controller";
import { ImagesService } from "./images.service";

import { Video } from "src/entities/video.entity";
import { Image } from "src/entities/image.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Image, Video])],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
