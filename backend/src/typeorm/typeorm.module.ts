import { DataSource } from "typeorm";
import { Global, Module } from "@nestjs/common";
import { User } from "src/entities/user.entity";
import { Article } from "src/entities/article.entity";
import { Category } from "src/entities/category.entity";
import { Image } from "src/entities/image.entity";
import { Role } from "src/entities/role.entity";
import { Video } from "src/entities/video.entity";
import { ArticleStatus } from "src/entities/articleStatus.entity";

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [Article, ArticleStatus, Category, Image, Role, User, Video],
  migrations: [__dirname + "../migrations/*.{ts,js}"],
  migrationsTableName: "typeorm_migrations",
  migrationsRun: true,
  synchronize: true,
  logging: process.env.NODE_ENV === "development",
});

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: DataSource,
      inject: [],
      useFactory: async () => {
        try {
          await dataSource.initialize();
          console.log("Database connected successfully");
          return dataSource;
        } catch (error) {
          console.log("Error connecting to database");
          throw error;
        }
      },
    },
  ],
  exports: [DataSource],
})
export class TypeOrmModule {}
