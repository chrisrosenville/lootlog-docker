"use server";

import { serverFetch } from "..";

import {
  getRefreshTokenFromResponse,
  removeRefreshToken,
  setRefreshToken,
} from "@/utils/cookies";

export async function signUpAction(credentials: FormData) {
  const userName = credentials.get("userName");
  const firstName = credentials.get("firstName");
  const lastName = credentials.get("lastName");
  const email = credentials.get("email");
  const password = credentials.get("password");
  const repeatPassword = credentials.get("repeatPassword");

  const res = await serverFetch(`/auth/sign-up`, {
    method: "POST",
    body: JSON.stringify({
      userName: userName as string,
      firstName: firstName as string,
      lastName: lastName as string,
      email: email as string,
      password: password as string,
      repeatPassword: repeatPassword as string,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  console.log("Direct response:", res);

  return await res.json();
}

export async function signInAction(credentials: FormData) {
  const email = credentials.get("email");
  const password = credentials.get("password");

  const res = await serverFetch(`/auth/sign-in`, {
    method: "POST",
    body: JSON.stringify({
      email: email as string,
      password: password as string,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const { cookieName, cookieValue } = getRefreshTokenFromResponse(res);

  if (!cookieName || !cookieValue) {
    throw new Error("Refresh token not found");
  }

  await setRefreshToken(cookieValue);

  return await res.json();
}

export async function signOutAction(tokenValue: string) {
  const response = await serverFetch(`/auth/sign-out`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenValue}`,
    },
  });

  if (response.ok) {
    await removeRefreshToken();
  }

  return await response.json();
}

export async function refreshAccessToken() {
  const res = await serverFetch(`/auth/refresh-access-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}
