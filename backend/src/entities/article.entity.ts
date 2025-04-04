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

  @Column({ default: "draft" })
  public_status: string;

  @Column({ default: false })
  feature_status: boolean;

  @OneToOne(() => Image, (image) => image.article, {
    cascade: ["insert", "insert", "recover", "remove", "soft-remove"],
  })
  @JoinColumn()
  image: Image;

  @OneToOne(() => Video, (video) => video.article, {
    cascade: ["insert", "insert", "recover", "remove", "soft-remove"],
  })
  @JoinColumn()
  video: Video;

  @ManyToOne(() => User, (user) => user.articles, {
    cascade: ["insert", "insert", "recover", "remove", "soft-remove"],
  })
  author: Partial<User>;

  @ManyToOne(() => Category, (category) => category.articles, {
    cascade: ["insert", "insert", "recover", "remove", "soft-remove"],
  })
  category: Category;
}
