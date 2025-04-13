import { UserRoles } from "@/types/user.types";

type TRoutePermissions = {
  [key: string]: UserRoles[];
};

export const ROUTE_PERMISSIONS: TRoutePermissions = {
  "/dashboard": ["admin", "author", "user"],
  "/dashboard/create-article": ["admin", "author"],
  "/dashboard/my-articles": ["admin", "author"],
  "/dashboard/manage-users": ["admin"],
  "/dashboard/analytics": ["admin"],
};
