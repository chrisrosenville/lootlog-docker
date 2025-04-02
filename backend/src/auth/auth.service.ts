import { Request } from "express";
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { hash, compare } from "../utils/hash";
import { UsersService } from "src/users/users.service";
import { createDateFromNow } from "src/createDateFromNow";
import { User } from "src/entities/user.entity";
import { SignupDto } from "src/users/dto/signup.dto";
import session from "express-session";

interface UserSessionData {
  userId: number;
  email: string;
  roles: string[];
}

declare module "express-session" {
  interface Session {
    user?: UserSessionData;
  }
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(
    credentials: {
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
    },
    res: Response,
  ) {
    if (credentials.password !== credentials.confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    const user = await this.usersService.getUserByEmail(credentials.email);
    if (user) {
      throw new BadRequestException("User already exists");
    }

    const newUser = await this.usersService.createUser({
      userName: credentials.username,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      email: credentials.email,
      password: credentials.password,
    });

    if (!newUser) {
      throw new InternalServerErrorException(
        "We encountered an error while creating your account. Please try again later.",
      );
    }

    return res.status(HttpStatus.CREATED).json({
      message: "Account created successfully",
      OK: true,
    });
  }

  async signIn(
    credentials: { email: string; password: string },
    req: Request,
    res: Response,
  ) {
    const user = await this.usersService.getUserByEmail(credentials.email);
    if (!user) throw new UnauthorizedException("Invalid email");

    const isPasswordValid = await compare(credentials.password, user.password);
    console.log("Is password valid:", isPasswordValid);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }

    const { password, refreshToken, ...safeUser } = user;

    const sessionData = {
      userId: user.id,
      email: user.email,
      roles: user.roles,
    };

    req.session.regenerate((err) => {
      if (err) {
        throw new InternalServerErrorException(
          "We encountered an error while signing in. Please try again later.",
        );
      }

      console.log("Setting session data:", sessionData);
      req.session.user = sessionData;

      req.session.save((err) => {
        if (err) {
          throw new InternalServerErrorException(
            "We encountered an error while signing in. Please try again later.",
          );
        }

        return res.status(HttpStatus.OK).json({
          message: "Signed in successfully",
          OK: true,
          user: safeUser,
        });
      });
    });
  }

  // async createUser(user: SignupDto, res: Response) {
  //   const newUser = await this.usersService.createUser(user);

  //   if (!newUser) {
  //     throw new InternalServerErrorException(
  //       "We encountered an error while creating your account. Please try again later.",
  //     );
  //   }

  //   return res
  //     .status(HttpStatus.CREATED)
  //     .json({ message: "Account created successfully", OK: true });
  // }

  // async getUserDetails(userId: number) {
  //   const user = await this.usersService.getUserById(userId);

  //   if (!user) {
  //     throw new ForbiddenException("User not found");
  //   }

  //   const { password, id, ...result } = user;

  //   return result;
  // }
}
