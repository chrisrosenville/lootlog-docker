import { Injectable } from "@nestjs/common";
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

import { UsersService } from "src/users/users.service";

@Injectable()
@ValidatorConstraint({ name: "IsEmailUnique", async: true })
export class IsEmailUnique implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}
  async validate(email: string, args: ValidationArguments): Promise<boolean> {
    const user = await this.usersService.findUserByEmail(email.toLowerCase());
    return !user;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "Entity not found";
  }
}
