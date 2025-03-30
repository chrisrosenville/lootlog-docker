import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const userFromRequest = context.switchToHttp().getRequest().user;
    const { password, ...user } = userFromRequest;
    return user;
  },
);
