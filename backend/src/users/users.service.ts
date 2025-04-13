import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { hash } from "../utils/hash";

import { User } from "src/entities/user.entity";
import { SignupDto } from "./dto/signup.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { Request, Response } from "express";
import { AuthService } from "src/auth/auth.service";
import { extractSafeUserInfo } from "src/utils/extractSafeUserInfo";
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async getUserById(id: number) {
    return await this.userRepo.findOne({ where: { id } });
  }

  async getUserByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email } });
  }

  async getUser(id: number, res: Response) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException();
    }

    const safeUser = extractSafeUserInfo(user);

    return res.status(HttpStatus.OK).json({
      OK: true,
      message: "User fetched successfully",
      user: safeUser,
    });
  }

  async getUserArticles(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ["articles"],
    });
    console.log("Get user articles:", user.articles);
    return user.articles;
  }

  async getAllUsers(res: Response) {
    const allUsers = await this.userRepo.find();
    const safeUsers = allUsers.map((user) => {
      return {
        id: user.id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });

    return res.status(HttpStatus.OK).json({
      OK: true,
      message: "Users fetched successfully",
      users: safeUsers,
    });
  }

  async createUser(user: {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    try {
      const hashedPw = await hash(user.password);

      if (!hashedPw) throw new InternalServerErrorException();

      const newUser: Partial<User> = {
        userName: user.userName.toLowerCase(),
        firstName: user.firstName.toLowerCase(),
        lastName: user.lastName.toLowerCase(),
        email: user.email.toLowerCase(),
        password: hashedPw,
      };

      const createNewUser = this.userRepo.create(newUser);
      return await this.userRepo.save(createNewUser);
    } catch (err) {
      console.log("Unknown error on signup:", err);
      throw new InternalServerErrorException();
    }
  }

  async updateUser(userId: number, user: UpdateUserDto, res: Response) {
    const userFromDb = await this.getUserById(userId);
    if (!userFromDb) throw new NotFoundException();

    const mergedUser = { ...userFromDb, ...user };
    const updatedUser = await this.userRepo.update(userFromDb.id, mergedUser);

    if (!updatedUser) {
      throw new InternalServerErrorException();
    }

    return res.status(HttpStatus.OK).json({
      OK: true,
      message: "User updated successfully",
      user: mergedUser,
    });
  }

  // async deleteUser(userId: number) {
  //   const userFromDb = await this.userRepo.findOne({ where: { id: userId } });
  //   if (userFromDb) {
  //     const removedUser = await this.userRepo.remove(userFromDb);
  //     console.log("Removed user:", removedUser);
  //     return removedUser;
  //   } else throw new NotFoundException();
  // }
}
