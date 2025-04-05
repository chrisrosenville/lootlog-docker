import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { Article } from "./article.entity";

export enum ArticleStatusEnum {
  DRAFT = "draft",
  PENDING = "pending",
  REJECTED = "rejected",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

@Entity()
export class ArticleStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: ArticleStatusEnum,
    default: ArticleStatusEnum.DRAFT,
  })
  status: ArticleStatusEnum;

  @OneToMany(() => Article, (article) => article.status)
  articles: Article[];
}
