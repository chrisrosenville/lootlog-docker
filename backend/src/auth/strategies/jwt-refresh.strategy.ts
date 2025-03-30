import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";

import { AuthService } from "../auth.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: (req: Request) => {
        const cookie = req.headers.cookie;
        if (cookie) {
          return cookie
            .split(";")
            .find((c) => c.trim().startsWith("refresh="))
            .split("=")[1];
        } else return null;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const token = req.headers.cookie;
    const refreshToken = token.split("=")[1];

    const user = await this.authService.verifyRefreshToken(
      refreshToken,
      payload.id,
    );
    return user;
  }
}
