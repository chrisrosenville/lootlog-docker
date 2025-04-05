import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SeederService } from "./seeder.service";
import { User } from "src/entities/user.entity";
import { Category } from "src/entities/category.entity";
import { Role } from "src/entities/role.entity";
import { ArticleStatus } from "src/entities/articleStatus.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Category, Role, ArticleStatus])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
