import { Article } from "./../entities/article.entity";

import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateArticleDto } from "./dto/CreateArticle.dto";
import { UpdateArticleDto } from "./dto/UpdateArticle.dto";

import { User } from "src/entities/user.entity";

import { CategoriesService } from "src/categories/categories.service";
import { UsersService } from "src/users/users.service";
import { ImagesService } from "src/images/images.service";

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    private categoriesService: CategoriesService,
    private usersService: UsersService,
    private imagesService: ImagesService,
  ) {}

  // async getAllArticles(): Promise<Article[]> {
  //   return await this.articleRepo.find({ relations: ["category"] });
  // }

  // async getFrontpageArticles() {
  //   const latestFeatured = await this.articleRepo.findOne({
  //     where: { public_status: "public", feature_status: true },
  //     relations: ["image"],
  //     select: {
  //       image: { url: true, name: true },
  //     },
  //   });

  //   const latestReviews = await this.articleRepo.find({
  //     where: {
  //       public_status: "public",
  //       feature_status: false,
  //       category: { name: "review" },
  //     },
  //     relations: ["image", "category"],
  //     select: {
  //       image: { url: true, name: true },
  //       category: { name: true },
  //     },
  //     order: { createdAt: "DESC" },
  //     take: 10,
  //   });

  //   const latestNews = await this.articleRepo.find({
  //     where: {
  //       public_status: "public",
  //       feature_status: false,
  //       category: { name: "news" },
  //     },
  //     relations: ["image", "category"],
  //     select: {
  //       image: { url: true, name: true },
  //       category: { name: true },
  //     },
  //     order: { createdAt: "DESC" },
  //     take: 10,
  //   });

  //   const latestTech = await this.articleRepo.find({
  //     where: {
  //       public_status: "public",
  //       feature_status: false,
  //       category: { name: "tech" },
  //     },
  //     relations: ["image", "category"],
  //     select: {
  //       image: { url: true, name: true },
  //       category: { name: true },
  //     },
  //     order: { createdAt: "DESC" },
  //     take: 10,
  //   });

  //   const combinedArticleArray = [
  //     ...latestNews,
  //     ...latestReviews,
  //     ...latestTech,
  //   ].sort(
  //     (a: Article, b: Article) =>
  //       parseInt(a.createdAt.toDateString()) -
  //       parseInt(b.createdAt.toDateString()),
  //   );

  //   return {
  //     featured: latestFeatured,
  //     articles: combinedArticleArray,
  //   };
  // }

  // async getArticlesByAuthor(userId: number): Promise<Article[]> {
  //   return await this.articleRepo.find({
  //     where: { author: { id: userId } },
  //     relations: ["category"],
  //   });
  // }

  // async getArticlesByCategory(categoryId: number): Promise<Article[]> {
  //   return await this.articleRepo.find({
  //     where: { category: { id: categoryId } },
  //     select: {
  //       author: { userName: true },
  //     },
  //   });
  // }

  // async getArticlesByCategoryAndAmount(
  //   name: string,
  //   amount: number,
  // ): Promise<Article[]> {
  //   return await this.articleRepo.find({
  //     where: { category: { name } },
  //     relations: ["image", "author"],
  //     select: {
  //       author: { userName: true },
  //       image: { name: true, url: true },
  //     },
  //     order: { createdAt: "DESC" },
  //     skip: amount - 20,
  //     take: 20,
  //   });
  // }

  // async getArticleById(id: number): Promise<Article> {
  //   return await this.articleRepo.findOne({
  //     where: { id },
  //     relations: ["category", "image", "author"],
  //     select: {
  //       category: { id: true, name: true },
  //       image: { id: true, name: true, url: true },
  //       author: { userName: true },
  //     },
  //   });
  // }

  // async getUserArticleById(
  //   userId: number,
  //   articleId: number,
  // ): Promise<Article> {
  //   return await this.articleRepo.findOne({
  //     where: { id: articleId, author: { id: userId } },
  //     relations: ["category", "image", "author"],
  //     select: {
  //       category: { id: true, name: true },
  //       author: { userName: true },
  //     },
  //   });
  // }

  // async togglePublicStatus(id: number) {
  //   const article = await this.articleRepo.findOneBy({ id });

  //   if (!article) {
  //     throw new Error("Article not found");
  //   }

  //   article.public_status =
  //     article.public_status === "public" ? "private" : "public";
  //   return await this.articleRepo.save(article);
  // }

  // async toggleFeatureStatus(id: number) {
  //   const article = await this.articleRepo.findOneBy({ id });

  //   if (!article) {
  //     throw new Error("Article not found");
  //   }

  //   article.feature_status = !article.feature_status;
  //   return await this.articleRepo.save(article);
  // }

  // async createArticle(user: User, createArticleDto: CreateArticleDto) {
  //   const author = await this.usersService.getUserById(user.id);
  //   const category = await this.categoriesService.getByName(
  //     createArticleDto.categoryName,
  //   );

  //   try {
  //     const newArticle = new Article();
  //     newArticle.title = createArticleDto.title;
  //     newArticle.body = createArticleDto.body;
  //     newArticle.category = category;
  //     newArticle.author = author;

  //     if (createArticleDto.imageAsFile) {
  //       const articleImage = await this.imagesService.create(
  //         createArticleDto.imageAsFile,
  //       );
  //       newArticle.image = articleImage;
  //     }

  //     const createArticle = this.articleRepo.create(newArticle);
  //     return await this.articleRepo.save(createArticle);
  //   } catch (err) {
  //     console.error("Error creating article:", err);
  //     throw new Error("Error creating article");
  //   }
  // }

  // async updateArticle(
  //   articleId: number,
  //   updatedArticle: UpdateArticleDto,
  //   userId: number,
  // ): Promise<Article> {
  //   // Get the new category for the updated article
  //   try {
  //     const originalArticle = await this.articleRepo.findOne({
  //       where: { id: articleId },
  //       relations: { author: true, image: true },
  //     });

  //     const currentUser = await this.usersService.getUserById(userId);

  //     if (
  //       originalArticle.author.id !== userId ||
  //       !currentUser.roles.includes("admin")
  //     ) {
  //       console.error("This user is not allowed to update this article");
  //       throw new UnauthorizedException(
  //         "You are not allowed to update this article",
  //       );
  //     }

  //     const category = await this.categoriesService.getByName(
  //       updatedArticle.categoryName,
  //     );

  //     const image = await this.imagesService.getImageById(
  //       originalArticle.image.id,
  //     );

  //     const newArticle = new Article();

  //     if (updatedArticle.imageAsFile) {
  //       // Create the new image in storage
  //       const newArticleImage = await this.imagesService.create(
  //         updatedArticle.imageAsFile,
  //       );
  //       if (!newArticleImage) {
  //         console.error("Error creating new image:", newArticleImage);
  //         throw new InternalServerErrorException();
  //       }

  //       newArticle.image = newArticleImage;
  //     }

  //     newArticle.id = originalArticle.id;
  //     newArticle.title = updatedArticle.title || originalArticle.title;
  //     newArticle.body = updatedArticle.body || originalArticle.body;
  //     newArticle.category = category;
  //     newArticle.author = originalArticle.author;
  //     newArticle.public_status =
  //       updatedArticle.public_status || originalArticle.public_status;
  //     newArticle.feature_status =
  //       updatedArticle.feature_status || originalArticle.feature_status;
  //     newArticle.video = updatedArticle.video || originalArticle.video;
  //     newArticle.createdAt = originalArticle.createdAt;

  //     const saved = await this.articleRepo.save(newArticle);

  //     // Delete the previous image from storage
  //     await this.imagesService.deleteByName(originalArticle.image.name);

  //     return saved;
  //   } catch (error) {
  //     console.error("Error updating article:", error);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async deleteArticle(article: Article) {
  //   try {
  //     if (article.image)
  //       await this.imagesService.deleteByName(article.image.name);

  //     return await this.articleRepo.delete(article.id);
  //   } catch (err) {
  //     console.error("Error deleting article:", err);
  //     throw new InternalServerErrorException();
  //   }
  // }
}
