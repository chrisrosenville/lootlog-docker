import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import { json } from "express";
import { useContainer } from "class-validator";

import session from "express-session";
import { ConfigService } from "@nestjs/config";

import { corsOptions } from "./lib/cors";
import { pgPool } from "./lib/dbPool";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["debug", "error", "fatal", "log", "verbose", "warn"],
  });
  const configService = app.get(ConfigService);

  app.enableCors(corsOptions);
  app.use(json({ limit: "10mb" }));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(
    session({
      store: new (require("connect-pg-simple")(session))({
        pool: pgPool,
        tableName: "sessions",
        createTableIfMissing: true,
        pruneSessionInterval: 24 * 60 * 60, // 24 hours in seconds
      }),
      proxy: true,
      secret: configService.get("SESSION_SECRET"),
      resave: true,
      saveUninitialized: false,
      rolling: true,
      name: "connect.sid",
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    }),
  );

  await app.listen(3456);
}
bootstrap();
