import { Controller, Post, Body } from "@nestjs/common";
import { ArticleStatusesService } from "./article-statuses.service";

@Controller("article-statuses")
export class ArticleStatusesController {
  constructor(private readonly articleStatusesRepo: ArticleStatusesService) {}
}
