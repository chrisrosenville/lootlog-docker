"use server";

import { TSignupCredentials, TLoginCredentials } from "@/types/form.types";
import { serverFetch } from "..";

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

  console.log("Direct response:", res);

  return await res.json();
}

export async function signUp(data: TSignupCredentials) {
  const response = await serverFetch(`/auth/sign-up`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.log(response);
    return null;
  }

  const res = await response.json();

  return res;
}

export async function login(user: TLoginCredentials) {
  const response = await serverFetch(`/auth/sign-in`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return response;
}

export async function logout() {
  const response = await serverFetch(`/auth/sign-out`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return response;
}

export async function refreshToken() {
  const response = await serverFetch(`/auth/refresh`, {
    method: "GET",
    credentials: "include",
  });

  return response;
}
