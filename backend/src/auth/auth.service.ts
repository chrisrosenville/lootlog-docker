import { Request } from "express";
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { compare } from "../utils/hash";
import { UsersService } from "src/users/users.service";
import { Session } from "express-session";
import { extractSafeUserInfo } from "src/utils/extractSafeUserInfo";
interface UserSessionData {
  userId: number;
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

  async validateSession(req: Request): Promise<number> {
    if (!req.session.user) {
      throw new UnauthorizedException("No active session");
    }

    return req.session.user.userId;
  }

  async getCurrentValidatedUser(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const validatedUserId = await this.validateSession(req);
    const user = await this.usersService.getUserById(validatedUserId);

    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: "User not found",
        OK: false,
      });
    }

    const safeUser = extractSafeUserInfo(user);

    return res.status(HttpStatus.OK).json({
      message: "User retrieved successfully",
      OK: true,
      user: safeUser,
    });
  }

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
    if (req.session.user) {
      return res.status(HttpStatus.OK).json({
        message: "Already signed in",
        OK: true,
      });
    }

    const user = await this.usersService.getUserByEmail(credentials.email);
    if (!user) throw new UnauthorizedException("Invalid email");

    const isPasswordValid = await compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }

    const sessionData = {
      userId: user.id,
    };

    return new Promise((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) {
          reject(
            new InternalServerErrorException(
              "We encountered an error while signing in. Please try again later.",
            ),
          );
          return;
        }

        req.session.user = sessionData;

        req.session.save((err) => {
          if (err) {
            reject(
              new InternalServerErrorException(
                "We encountered an error while signing in. Please try again later.",
              ),
            );
            return;
          }

          resolve(
            res.status(HttpStatus.OK).json({
              message: "Signed in successfully",
              OK: true,
            }),
          );
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
