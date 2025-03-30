import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { hash, compare } from "src/hashing";
import { UsersService } from "src/users/users.service";
import { createDateFromNow } from "src/createDateFromNow";
import { User } from "src/entities/user.entity";
import { SignupDto } from "src/users/dto/signup.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async verifyEmailPassword(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);

    if (user) {
      const isPasswordMatch = await compare(password, user.password);

      if (isPasswordMatch) {
        const { password, ...result } = user;
        return result;
      }
    }

    throw new UnauthorizedException("Wrong email or password");
  }

  async createAccessToken(payload: Partial<User>) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS}ms`,
    });

    const accessTokenExpirationDate = createDateFromNow(
      process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS,
    );

    return {
      accessToken: accessToken,
      accessTokenExpiration: accessTokenExpirationDate,
    };
  }
  async createRefreshToken(payload: Partial<User>) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS}ms`,
    });

    const refreshTokenExpirationDate = createDateFromNow(
      process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS,
    );

    return {
      refreshToken: refreshToken,
      refreshTokenExpiration: refreshTokenExpirationDate,
    };
  }

  async verifyRefreshToken(token: string, userId: number) {
    const user = await this.usersService.findUserById(userId);

    if (user) {
      const isTokenValid = await compare(token, user.refreshToken);

      if (isTokenValid) return user;
    }

    throw new ForbiddenException();
  }

  async signIn(user: User, res: Response) {
    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
    };

    const { accessToken, accessTokenExpiration } =
      await this.createAccessToken(payload);
    const { refreshToken, refreshTokenExpiration } =
      await this.createRefreshToken(payload);

    await this.usersService.updateUser(user.id, {
      refreshToken: await hash(refreshToken),
    });

    res.cookie("session", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires: accessTokenExpiration,
    });

    res.cookie("refresh", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires: refreshTokenExpiration,
    });

    return res.status(HttpStatus.OK).json({ message: "OK" });
  }

  async createUser(user: SignupDto, res: Response) {
    const newUser = await this.usersService.createUser(user);

    if (newUser) {
      const payload = {
        email: newUser.email,
        firstName: newUser.firstName,
      };

      const { accessToken, accessTokenExpiration } =
        await this.createAccessToken(payload);
      const { refreshToken, refreshTokenExpiration } =
        await this.createRefreshToken(payload);

      const updatedResult = await this.usersService.updateUser(newUser.id, {
        refreshToken: await hash(refreshToken),
      });

      if (updatedResult) {
        res.cookie("session", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          expires: accessTokenExpiration,
        });

        res.cookie("refresh", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          expires: refreshTokenExpiration,
        });

        return res.status(HttpStatus.CREATED).json({ message: "OK" });
      }

      throw new ForbiddenException(
        "We encountered an error while creating your account. Please try again later.",
      );
    }

    throw new ForbiddenException(
      "Your account could not be created. Please try again later.",
    );
  }

  async getUserDetails(userId: number) {
    return await this.usersService.findUserById(userId);
  }
}
