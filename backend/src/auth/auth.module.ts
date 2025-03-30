import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";

import { UsersModule } from "src/users/users.module";
import { IsUsernameUnique } from "src/lib/validators/is-username-unique.validator";
import { IsEmailUnique } from "src/lib/validators/is-email-unique.validator";

@Module({
  imports: [UsersModule, PassportModule, JwtModule],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    IsUsernameUnique,
    IsEmailUnique,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
