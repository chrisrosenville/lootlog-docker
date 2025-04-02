import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { json } from "express";
import { useContainer } from "class-validator";

import session from "express-session";
import { ConfigService } from "@nestjs/config";

import pg = require("pg");

const pgPool = new pg.Pool({
  database: process.env.POSTGRES_DATABASE,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

const corsOptions: CorsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

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
      }),
      proxy: true,
      secret: configService.get("SESSION_SECRET"),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite:
          configService.get("NODE_ENV") === "production" ? "lax" : "none",
        secure: configService.get("NODE_ENV") === "production",
        maxAge: parseInt(configService.get("SESSION_COOKIE_MAX_AGE")),
      },
    }),
  );

  await app.listen(3456);
}
bootstrap();
