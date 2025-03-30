import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { json } from "express";
import { useContainer } from "class-validator";

const session = require("cookie-session");

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

  app.useLogger(["debug", "error"]);

  app.enableCors(corsOptions);
  app.use(json({ limit: "10mb" }));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(
    session({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    }),
  );

  await app.listen(3456);
}
bootstrap();
