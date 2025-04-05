import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  ArticleStatus,
  ArticleStatusEnum,
} from "src/entities/articleStatus.entity";
import { Repository } from "typeorm";

@Injectable()
export class ArticleStatusesService {
  constructor(
    @InjectRepository(ArticleStatus)
    private articleStatusRepository: Repository<ArticleStatus>,
  ) {}

  async createArticleStatus(status?: ArticleStatusEnum) {
    if (!status) {
      status = ArticleStatusEnum.DRAFT;
    }

    const newStatus = new ArticleStatus();
    newStatus.status = status;
    return this.articleStatusRepository.save(newStatus);
  }
}
