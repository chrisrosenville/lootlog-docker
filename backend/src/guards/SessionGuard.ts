import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class SessionGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isSessionValid = !!request.session.user.userId;

    if (!isSessionValid) {
      throw new UnauthorizedException("No active session");
    }

    return true;
  }
}
