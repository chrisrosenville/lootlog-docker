import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Video } from "src/entities/video.entity";
import { Repository } from "typeorm";

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
  ) {}

  async createVideo(videoUrl: string) {
    const video = new Video();
    video.url = videoUrl;
    const savedVideo = this.videoRepository.create(video);
    return await this.videoRepository.save(savedVideo);
  }
}
