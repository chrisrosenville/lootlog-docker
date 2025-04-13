import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
} from "@nestjs/common";
import { ArticlesService } from "./articles.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { UseInterceptors } from "@nestjs/common";

import { CreateArticleDto } from "./dto/CreateArticle.dto";
import { Request, Response } from "express";
import { AdminGuard } from "src/guards/AdminGuard";
import { AuthorGuard } from "src/guards/AuthorGuard";
import { ArticleStatusEnum } from "src/entities/articleStatus.entity";
import { UpdateArticleDto } from "./dto/UpdateArticle.dto";

@Controller("/articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(AuthorGuard)
  @UseInterceptors(FileInterceptor("image"))
  async createArticle(
    @Req() req: Request,
    @Res() res: Response,
    @Body() article: CreateArticleDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.articlesService.createArticle(req, res, {
      ...article,
      image: image,
    });
  }

  @Put("/:id")
  @UseGuards(AuthorGuard)
  @UseInterceptors(FileInterceptor("image"))
  async updateArticleById(
    @Param("id") id: string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() article: UpdateArticleDto,
    @UploadedFile() newImage: Express.Multer.File,
  ) {
    console.log("New image:", newImage);
    console.log("Article to be updated:", article);
    return this.articlesService.updateArticleById(
      parseInt(id),
      req,
      res,
      article,
      newImage,
    );
  }

  @Delete("/:id")
  @UseGuards(AdminGuard)
  async deleteArticle(@Param("id") id: string, @Res() res: Response) {
    return this.articlesService.deleteArticle(parseInt(id), res);
  }

  @Get()
  @UseGuards(AdminGuard)
  async getAllArticles(@Res() res: Response) {
    return this.articlesService.getAllArticles(res);
  }

  @Get("/frontpage")
  async getFrontpageArticles(@Res() res: Response) {
    return this.articlesService.getFrontpageArticles(res);
  }

  @Get("/:id")
  async getArticleById(@Param("id") id: string, @Res() res: Response) {
    return this.articlesService.getArticleById(parseInt(id), res);
  }

  @Get("/admin/:id")
  @UseGuards(AuthorGuard)
  async getArticlesByUserId(
    @Param("id") id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.articlesService.getArticlesByUserId(parseInt(id), req, res);
  }

  @Get("/author/:id")
  @UseGuards(AuthorGuard)
  async getArticlesByAuthor(
    @Param("id") id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (req.session.user.userId !== parseInt(id)) {
      throw new ForbiddenException();
    }

    return this.articlesService.getArticlesByAuthor(parseInt(id), res);
  }

  @Put("/status/:id")
  @UseGuards(AdminGuard)
  async updateArticleStatus(
    @Param("id") id: string,
    @Body() body: { status: ArticleStatusEnum },
    @Res() res: Response,
  ) {
    return this.articlesService.updateArticleStatus(
      parseInt(id),
      body.status,
      res,
    );
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
