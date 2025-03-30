"use server";
import { cookies } from "next/headers";

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
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    const cookiesFromHeader = res.headers.getSetCookie();
    const sessionCookie = cookiesFromHeader.find((cookie) =>
      cookie.includes("session"),
    );
    const cookieString = sessionCookie?.split(";")[0];
    const cookieObject = cookieString?.split("=");
    const cookieName = cookieObject?.[0];
    const cookieValue = cookieObject?.[1];

    (await cookies()).set(cookieName as string, cookieValue as string);

    console.log("Cookie:", cookies);
    console.log("Session cookie:", sessionCookie);
    console.log("Cookie name:", cookieName);
    console.log("Cookie value:", cookieValue);
  }

  console.log("Direct response:", res);

  return await res.json();
}

export async function logout() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  const response = await serverFetch(`/auth/sign-out`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${sessionCookie?.name}=${sessionCookie?.value};`,
    },
    credentials: "include",
  });

  if (response.ok) {
    (await cookies()).delete("session");
    (await cookies()).delete("refresh");
  }

  return await response.json();
}
