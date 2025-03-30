import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ArticlesService } from "./articles.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "src/entities/user.entity";
import { CreateArticleDto } from "./dto/CreateArticle.dto";
import { UpdateArticleDto } from "./dto/UpdateArticle.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("/articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllArticles(@CurrentUser() user: User) {
    if (user.role === "admin") return this.articlesService.getAllArticles();
    else if (user.role === "author")
      return this.articlesService.getArticlesByAuthor(user.id);
    else throw new ForbiddenException();
  }

  @Get("/:id(\\d+)")
  async getArticleById(@Param("id") id: string) {
    return this.articlesService.getArticleById(parseInt(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("image"))
  async createArticle(
    @CurrentUser() user: User,
    @UploadedFile() image: Express.MulterFile,
    @Body() body: CreateArticleDto,
  ) {
    console.log("User:", user);
    console.log("Image:", image);
    console.log("Body:", body);

    if (user.role === "admin" || user.role === "author") {
      const article = { ...body, imageAsFile: image };

      return await this.articlesService.createArticle(user, article);
    }

    throw new ForbiddenException();
  }

  @Put("/:id")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("image"))
  async updateArticleById(
    @CurrentUser() user: User,
    @UploadedFile() image: Express.MulterFile,
    @Body() body: UpdateArticleDto,
    @Param("id") id: string,
  ) {
    console.log("Body:", body);
    console.log("Image:", image);

    const article = { ...body, imageAsFile: image };
    return this.articlesService.updateArticle(parseInt(id), article, user.id);
  }

  @Get("/frontpage")
  async getFrontpageArticles() {
    return this.articlesService.getFrontpageArticles();
  }

  @Get("/category/:id")
  async getArticlesByCategory(@Param("id") id: string) {
    return this.articlesService.getArticlesByCategory(parseInt(id));
  }

  @Get("/category/:name/:amount")
  async getArticlesByCategoryAndAmount(
    @Param("name") name: string,
    @Param("amount") amount: number,
  ) {
    return this.articlesService.getArticlesByCategoryAndAmount(name, amount);
  }

  @Get("/user")
  @UseGuards(JwtAuthGuard)
  async getArticlesByUser(@CurrentUser() user: User) {
    return this.articlesService.getArticlesByAuthor(user.id);
  }

  @Get("/user/:id")
  @UseGuards(JwtAuthGuard)
  async getUserArticleById(@CurrentUser() user: User, @Param("id") id: string) {
    return this.articlesService.getUserArticleById(user.id, parseInt(id));
  }

  @Post("/:id/toggle-public")
  @UseGuards(JwtAuthGuard)
  async togglePublicStatus(@CurrentUser() user: User, @Param("id") id: string) {
    if (user.role !== "admin") throw new UnauthorizedException();
    return await this.articlesService.togglePublicStatus(parseInt(id));
  }

  @Post("/:id/toggle-featured")
  @UseGuards(JwtAuthGuard)
  async toggleFeatureStatus(
    @CurrentUser() user: User,
    @Param("id") id: string,
  ) {
    if (user.role !== "admin") throw new UnauthorizedException();
    return await this.articlesService.toggleFeatureStatus(parseInt(id));
  }

  @Delete("/:id")
  @UseGuards(JwtAuthGuard)
  async deleteArticle(@Param("id") id: string, @CurrentUser() user: User) {
    const article = await this.articlesService.getArticleById(parseInt(id));

    if (user.role === "admin" || user.id === article.author.id) {
      return this.articlesService.deleteArticle(article);
    }

    throw new ForbiddenException();
  }
}
