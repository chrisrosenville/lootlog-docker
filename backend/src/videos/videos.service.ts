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

  async createVideo(
    videoUrl: string,
  ): Promise<{ error: boolean; message: string; video: Video | null }> {
    const existingVideo = await this.videoRepository.findOne({
      where: { url: videoUrl },
    });
    if (existingVideo) {
      return {
        error: true,
        message: "Video already exists",
        video: null,
      };
    }

    const video = new Video();
    video.url = videoUrl;
    const videoInstance = this.videoRepository.create(video);
    const savedVideo = await this.videoRepository.save(videoInstance);

    return {
      error: false,
      message: "Video created successfully",
      video: savedVideo,
    };
  }

  async deleteById(id: number): Promise<{ error: boolean; message: string }> {
    const video = await this.videoRepository.findOne({ where: { id } });
    if (!video) {
      return {
        error: true,
        message: "Video not found",
      };
    }

    await this.videoRepository.remove(video);

    return {
      error: false,
      message: "Video deleted successfully",
    };
  }
}
