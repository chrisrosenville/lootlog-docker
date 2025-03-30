import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";

import { UsersService } from "src/users/users.service";
import { IUserToken } from "../types/auth.types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: (req: Request) => {
        const cookie = req.headers.cookie;
        if (cookie) {
          const sessionToken = cookie
            .split(";")
            .find((c) => c.includes("session="))
            .trim()
            .split("session=")[1];
          return sessionToken;
        } else return null;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: IUserToken) {
    return this.usersService.findUserById(payload.id);
  }
}
