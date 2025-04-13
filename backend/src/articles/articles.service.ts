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
import { Category } from "src/entities/category.entity";

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
    const newArticle = new Article();

    if (!article.image && !article.videoUrl) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Image or video is required",
        OK: false,
      });
    }

    if (article.image) {
      const uploadImage = await this.imagesService.create(article.image);

      if (uploadImage.error && !uploadImage.image) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: uploadImage.message,
          OK: false,
        });
      }

      newArticle.image = uploadImage.image;
    }

    if (article.videoUrl) {
      const uploadVideo = await this.videosService.createVideo(
        article.videoUrl,
      );

      if (uploadVideo.error && !uploadVideo.video) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: uploadVideo.message,
          OK: false,
        });
      }

      newArticle.video = uploadVideo.video;
    }

    const category = await this.categoriesService.getCategoryByName(
      article.categoryName,
    );
    if (!category) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Category not found",
        OK: false,
      });
    }

    const author = await this.usersService.getUserById(req.session.user.userId);

    newArticle.title = article.title;
    newArticle.body = article.body;
    newArticle.category = category;
    newArticle.author = author;

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

    if (article.title && article.title !== existingArticle.title) {
      existingArticle.title = article.title;
    }

    if (article.body && article.body !== existingArticle.body) {
      existingArticle.body = article.body;
    }

    if (!article.image && !article.videoUrl && !newImage) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "An image or a video URL is required",
        OK: false,
      });
    }

    if (newImage) {
      await this.imagesService.deleteFromStorage(existingArticle.image.name);

      const uploadImage = await this.imagesService.create(newImage);

      if (uploadImage.error && !uploadImage.image) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: uploadImage.message,
          OK: false,
        });
      }

      existingArticle.image = uploadImage.image;
    }

    if (article.videoUrl && article.videoUrl !== existingArticle.video?.url) {
      const deleteVideo = await this.videosService.deleteById(
        existingArticle.video.id,
      );
      if (deleteVideo.error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: deleteVideo.message,
          OK: false,
        });
      }

      const uploadVideo = await this.videosService.createVideo(
        article.videoUrl,
      );

      if (uploadVideo.error && !uploadVideo.video) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: uploadVideo.message,
          OK: false,
        });
      }

      existingArticle.video = uploadVideo.video;
    }

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

    const updatedArticle = await this.articleRepo.save(existingArticle);

    return res.status(HttpStatus.OK).json({
      message: "Article updated successfully",
      OK: true,
      article: updatedArticle,
    });
  }

  async deleteArticle(id: number, res: Response) {
    const article = await this.articleRepo.findOne({
      where: { id },
      relations: ["image", "video", "status", "category"],
    });

    if (!article) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Article not found",
        OK: false,
      });
    }

    await this.articleRepo.manager.transaction(
      async (transactionalEntityManager) => {
        if (article.image) {
          await transactionalEntityManager.delete(Image, article.image.id);
        }

        if (article.video) {
          await transactionalEntityManager.delete(Video, article.video.id);
        }

        await transactionalEntityManager.delete(
          ArticleStatus,
          article.status.id,
        );

        await transactionalEntityManager.delete(Category, article.category.id);

        await transactionalEntityManager.remove(article);
      },
    );

    const deleteFromStorage = await this.imagesService.deleteFromStorage(
      article.image.name,
    );
    if (deleteFromStorage.error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: deleteFromStorage.message,
        OK: false,
      });
    }

    return res.status(HttpStatus.OK).json({
      message: "Article deleted successfully",
      OK: true,
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
