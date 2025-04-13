import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
} from "typeorm";

import { Category } from "./category.entity";
import { User } from "./user.entity";
import { Image } from "./image.entity";
import { Video } from "./video.entity";
import { ArticleStatus } from "./articleStatus.entity";

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column()
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ArticleStatus, (status) => status.articles, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  status: ArticleStatus;

  @OneToOne(() => Image, (image) => image.article, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn()
  image: Image;

  @OneToOne(() => Video, (video) => video.article, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn()
  video: Video;

  @ManyToOne(() => User, (user) => user.articles, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  author: Partial<User>;

  @ManyToOne(() => Category, (category) => category.articles, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  category: Category;
}
