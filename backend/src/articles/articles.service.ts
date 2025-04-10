import { Article } from "./../entities/article.entity";
import {
  ArticleStatus,
  ArticleStatusEnum,
} from "./../entities/articleStatus.entity";

import { HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateArticleDto } from "./dto/CreateArticle.dto";

import { CategoriesService } from "src/categories/categories.service";
import { UsersService } from "src/users/users.service";
import { ImagesService } from "src/images/images.service";
import { Request, Response } from "express";
import { VideosService } from "src/videos/videos.service";
import { Image } from "src/entities/image.entity";
import { Video } from "src/entities/video.entity";
import { UpdateArticleDto } from "./dto/UpdateArticle.dto";

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(ArticleStatus)
    private articleStatusRepo: Repository<ArticleStatus>,
    private categoriesService: CategoriesService,
    private usersService: UsersService,
    private imagesService: ImagesService,
    private videosService: VideosService,
  ) {}

  async getAllArticles(res: Response) {
    const articles = await this.articleRepo.find({
      relations: ["category", "status", "author"],
    });

    return res.status(HttpStatus.OK).json({
      message: "Articles fetched successfully",
      OK: true,
      articles,
    });
  }

  async getArticleById(id: number, res: Response) {
    const article = await this.articleRepo.findOne({
      where: { id },
      relations: ["category", "image", "video", "author", "status"],
    });

    return res.status(HttpStatus.OK).json({
      message: "Article fetched successfully",
      OK: true,
      article,
    });
  }

  async getFrontpageArticles(res: Response) {
    const articles = await this.articleRepo.find({
      relations: ["category", "image", "video"],
      where: {
        status: { status: ArticleStatusEnum.PUBLISHED },
      },
      order: { createdAt: "DESC" },
      take: 16,
    });

    return res.status(HttpStatus.OK).json({
      message: "Articles fetched successfully",
      OK: true,
      articles,
    });
  }

  async getArticlesByUserId(id: number, req: Request, res: Response) {
    const articles = await this.articleRepo.find({
      where: { author: { id } },
      relations: ["category", "status"],
    });

    return res.status(HttpStatus.OK).json({
      message: "Articles fetched successfully",
      OK: true,
      articles,
    });
  }

  async getArticlesByAuthor(authorId: number, res: Response) {
    const articles = await this.articleRepo.find({
      where: { author: { id: authorId } },
      relations: ["category", "status"],
    });

    return res.status(HttpStatus.OK).json({
      message: "Articles fetched successfully",
      OK: true,
      articles,
    });
  }

  async createArticle(req: Request, res: Response, article: CreateArticleDto) {
    console.log("Article to be created:", article);

    if (!article.image && !article.videoUrl) {
      console.log("Image or video is required");
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Image or video is required",
        OK: false,
      });
    }

    let image: Image | null = null;
    let video: Video | null = null;

    if (article.image) {
      image = await this.imagesService.create(article.image);
      if (!image) {
        console.log("Error creating image");
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: "Error creating image",
          OK: false,
        });
      }
    }

    if (article.videoUrl) {
      video = await this.videosService.createVideo(article.videoUrl);
    }

    const category = await this.categoriesService.getCategoryByName(
      article.categoryName,
    );
    if (!category) {
      console.log("Category not found");
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Category not found",
        OK: false,
      });
    }

    const author = await this.usersService.getUserById(req.session.user.userId);

    const newArticle = new Article();
    newArticle.title = article.title;
    newArticle.body = article.body;
    newArticle.category = category;
    newArticle.author = author;
    newArticle.image = image;
    newArticle.video = video;
    newArticle.status = { status: ArticleStatusEnum.DRAFT } as ArticleStatus;

    const createdArticle = this.articleRepo.create(newArticle);
    const savedArticle = await this.articleRepo.save(createdArticle);

    console.log("Article created successfully:", savedArticle);

    return res.status(HttpStatus.CREATED).json({
      message: "Article created successfully",
      OK: true,
      article: savedArticle,
    });
  }

  async updateArticleById(
    id: number,
    req: Request,
    res: Response,
    article: UpdateArticleDto,
    newImage: Express.Multer.File,
  ) {
    const existingArticle = await this.articleRepo.findOne({
      where: { id },
      relations: ["category", "image", "video", "author", "status"],
    });

    if (!existingArticle) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Article not found",
        OK: false,
      });
    }

    if (req.session.user.userId !== existingArticle.author.id) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: "You are not authorized to update this article",
        OK: false,
      });
    }

    // Check if category needs to be updated
    if (
      article.categoryName &&
      article.categoryName !== existingArticle.category.name
    ) {
      const category = await this.categoriesService.getCategoryByName(
        article.categoryName,
      );
      if (!category) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: "Category not found",
          OK: false,
        });
      }
      existingArticle.category = category;
    }

    // Check if title needs to be updated
    if (article.title && article.title !== existingArticle.title) {
      existingArticle.title = article.title;
    }

    // Check if body needs to be updated
    if (article.body && article.body !== existingArticle.body) {
      existingArticle.body = article.body;
    }

    if (!article.image && !article.videoUrl && !newImage) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "An image or a video URL is required",
        OK: false,
      });
    }

    // Handle image update
    if (newImage) {
      await this.imagesService.deleteByName(existingArticle.image.name);
      const image = await this.imagesService.create(newImage);
      if (!image) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: "Error creating image",
          OK: false,
        });
      }
      existingArticle.image = image;
    }

    // Handle video update
    if (article.videoUrl && article.videoUrl !== existingArticle.video?.url) {
      const newVideo = await this.videosService.createVideo(article.videoUrl);
      existingArticle.video = newVideo;
    }

    // Set the status to DRAFT
    const status = await this.articleStatusRepo.findOne({
      where: { status: ArticleStatusEnum.DRAFT },
    });
    if (!status) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Error fetching status",
        OK: false,
      });
    }
    existingArticle.status = status;

    // Save the updated article
    const updatedArticle = await this.articleRepo.save(existingArticle);

    return res.status(HttpStatus.OK).json({
      message: "Article updated successfully",
      OK: true,
      article: updatedArticle,
    });
  }

  async updateArticleStatus(
    id: number,
    status: ArticleStatusEnum,
    res: Response,
  ) {
    const article = await this.articleRepo.findOneBy({ id });
    if (!article) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Article not found",
        OK: false,
      });
    }

    const newStatusMatch = await this.articleStatusRepo.findOne({
      where: { status },
    });

    if (!newStatusMatch) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Invalid status",
        OK: false,
      });
    }

    article.status = newStatusMatch;
    const updatedArticle = await this.articleRepo.save(article);

    return res.status(HttpStatus.OK).json({
      message: "Article status updated successfully",
      OK: true,
      article: updatedArticle,
    });
  }
}
