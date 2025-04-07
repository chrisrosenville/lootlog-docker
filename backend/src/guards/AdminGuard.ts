import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.session.user) {
      throw new UnauthorizedException("No active session");
    }

    const user = await this.usersService.getUserById(
      request.session.user.userId,
    );

    if (!user) {
      throw new UnauthorizedException("No active session");
    }

    if (!user.roles.includes("admin")) {
      throw new UnauthorizedException("User does not have admin privileges");
    }

    return true;
  }
}
