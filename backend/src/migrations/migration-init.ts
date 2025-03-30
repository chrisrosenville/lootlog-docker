import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationInit1711745200000 implements MigrationInterface {
  name = "MigrationInit1711745200000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "category" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" character varying,
                CONSTRAINT "PK_category_id" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "firstName" character varying,
                "lastName" character varying,
                CONSTRAINT "PK_user_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_user_email" UNIQUE ("email")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "article" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "content" text NOT NULL,
                "url" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                "categoryId" uuid,
                CONSTRAINT "PK_article_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_article_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL,
                CONSTRAINT "FK_article_category" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "video" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "url" character varying NOT NULL,
                "description" character varying,
                CONSTRAINT "PK_video_id" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "image" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "url" character varying NOT NULL,
                "alt" character varying,
                "caption" character varying,
                CONSTRAINT "PK_image_id" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "image"`);
    await queryRunner.query(`DROP TABLE "video"`);
    await queryRunner.query(`DROP TABLE "article"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
