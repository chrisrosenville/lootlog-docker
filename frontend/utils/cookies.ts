import { cookies } from "next/headers";

export const getRefreshTokenFromResponse = (
  res: Response,
): { cookieName: string; cookieValue: string } => {
  const cookiesFromHeader = res.headers.getSetCookie();
  const refreshTokenCookie = cookiesFromHeader.find((cookie) =>
    cookie.includes("refresh_token"),
  );

  const cookieString = refreshTokenCookie?.split(";")[0];
  const cookieObject = cookieString?.split("=");
  const cookieName = cookieObject?.[0];
  const cookieValue = cookieObject?.[1];

  return {
    cookieName: cookieName as string,
    cookieValue: cookieValue as string,
  };
};

export const setRefreshToken = async (value: string) => {
  (await cookies()).set("refresh_token", value);
};

export const removeRefreshToken = async () => {
  (await cookies()).delete("refresh_token");
};
