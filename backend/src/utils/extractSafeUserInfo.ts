import { User } from "src/entities/user.entity";

export const extractSafeUserInfo = (user: User) => {
  const { password, ...rest } = user;
  return rest;
};
