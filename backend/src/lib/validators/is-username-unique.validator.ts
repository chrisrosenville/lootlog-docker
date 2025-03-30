import { Injectable } from "@nestjs/common";
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

import { UsersService } from "src/users/users.service";

@Injectable()
@ValidatorConstraint({ name: "IsUsernameUnique", async: true })
export class IsUsernameUnique implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}
  async validate(
    username: string,
    args: ValidationArguments,
  ): Promise<boolean> {
    const user = await this.usersService.findUserByUsername(
      username.toLowerCase(),
    );
    return !user;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "Entity not found";
  }
}
