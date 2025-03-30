"use server";

import { TSignupCredentials, TLoginCredentials } from "@/types/form.types";
import { fetchFromBackend } from "..";

export async function signUpAction(data: FormData) {
  const userName = data.get("userName");
  const firstName = data.get("firstName");
  const lastName = data.get("lastName");
  const email = data.get("email");
  const password = data.get("password");
  const repeatPassword = data.get("repeatPassword");

  const res = await fetchFromBackend(`/auth/sign-up`, {
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

export async function signUp(data: TSignupCredentials) {
  const response = await fetchFromBackend(`/auth/sign-up`, {
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
  const response = await fetchFromBackend(`/auth/sign-in`, {
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
  const response = await fetchFromBackend(`/auth/sign-out`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return response;
}

export async function refreshToken() {
  const response = await fetchFromBackend(`/auth/refresh`, {
    method: "GET",
    credentials: "include",
  });

  return response;
}
