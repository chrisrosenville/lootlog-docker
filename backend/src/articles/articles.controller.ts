import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
} from "@nestjs/common";
import { ArticlesService } from "./articles.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { UseInterceptors } from "@nestjs/common";

import { CreateArticleDto } from "./dto/CreateArticle.dto";
import { Request, Response } from "express";

@Controller("/articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async getAllArticles(@Req() req: Request, @Res() res: Response) {
    return this.articlesService.getAllArticles(req, res);
  }

  @Post("/create")
  @UseInterceptors(FileInterceptor("images"))
  async createArticle(
    @Req() req: Request,
    @Res() res: Response,
    @Body() article: CreateArticleDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    console.log("Article to be created:", article);
    console.log("Image file:", image);

    return this.articlesService.createArticle(req, res, {
      ...article,
      image: image,
    });
  }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // async getAllArticles(@CurrentUser() user: User) {
  //   if (user.roles.includes("admin"))
  //     return this.articlesService.getAllArticles();
  //   else if (user.roles.includes("author"))
  //     return this.articlesService.getArticlesByAuthor(user.id);
  //   else throw new ForbiddenException();
  // }

  // @Get("/:id(\\d+)")
  // async getArticleById(@Param("id") id: string) {
  //   return this.articlesService.getArticleById(parseInt(id));
  // }

  // @Post()
  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(FileInterceptor("image"))
  // async createArticle(
  //   @CurrentUser() user: User,
  //   @UploadedFile() image: Express.MulterFile,
  //   @Body() body: CreateArticleDto,
  // ) {
  //   console.log("User:", user);
  //   console.log("Image:", image);
  //   console.log("Body:", body);

  //   if (user.roles.includes("admin") || user.roles.includes("author")) {
  //     const article = { ...body, imageAsFile: image };

  //     return await this.articlesService.createArticle(user, article);
  //   }

  //   throw new ForbiddenException();
  // }

  // @Put("/:id")
  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(FileInterceptor("image"))
  // async updateArticleById(
  //   @CurrentUser() user: User,
  //   @UploadedFile() image: Express.MulterFile,
  //   @Body() body: UpdateArticleDto,
  //   @Param("id") id: string,
  // ) {
  //   console.log("Body:", body);
  //   console.log("Image:", image);

  //   const article = { ...body, imageAsFile: image };
  //   return this.articlesService.updateArticle(parseInt(id), article, user.id);
  // }

  // @Get("/frontpage")
  // async getFrontpageArticles() {
  //   return this.articlesService.getFrontpageArticles();
  // }

  // @Get("/category/:id")
  // async getArticlesByCategory(@Param("id") id: string) {
  //   return this.articlesService.getArticlesByCategory(parseInt(id));
  // }

  // @Get("/category/:name/:amount")
  // async getArticlesByCategoryAndAmount(
  //   @Param("name") name: string,
  //   @Param("amount") amount: number,
  // ) {
  //   return this.articlesService.getArticlesByCategoryAndAmount(name, amount);
  // }

  // @Get("/user")
  // @UseGuards(JwtAuthGuard)
  // async getArticlesByUser(@CurrentUser() user: User) {
  //   return this.articlesService.getArticlesByAuthor(user.id);
  // }

  // @Get("/user/:id")
  // @UseGuards(JwtAuthGuard)
  // async getUserArticleById(@CurrentUser() user: User, @Param("id") id: string) {
  //   return this.articlesService.getUserArticleById(user.id, parseInt(id));
  // }

  // @Post("/:id/toggle-public")
  // @UseGuards(JwtAuthGuard)
  // async togglePublicStatus(@CurrentUser() user: User, @Param("id") id: string) {
  //   if (!user.roles.includes("admin")) throw new UnauthorizedException();
  //   return await this.articlesService.togglePublicStatus(parseInt(id));
  // }

  // @Post("/:id/toggle-featured")
  // @UseGuards(JwtAuthGuard)
  // async toggleFeatureStatus(
  //   @CurrentUser() user: User,
  //   @Param("id") id: string,
  // ) {
  //   if (!user.roles.includes("admin")) throw new UnauthorizedException();
  //   return await this.articlesService.toggleFeatureStatus(parseInt(id));
  // }

  // @Delete("/:id")
  // @UseGuards(JwtAuthGuard)
  // async deleteArticle(@Param("id") id: string, @CurrentUser() user: User) {
  //   const article = await this.articlesService.getArticleById(parseInt(id));

  //   if (user.roles.includes("admin") || user.id === article.author.id) {
  //     return this.articlesService.deleteArticle(article);
  //   }

  //   throw new ForbiddenException();
  // }
}
