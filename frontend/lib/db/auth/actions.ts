"use server";

import { serverFetch } from "..";

export async function verifySessionToken(tokenValue: string) {
  if (!tokenValue) return null;

  try {
    const res = await serverFetch(`/auth/verify`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${tokenValue}`,
      },
      cache: "no-cache",
    });

    if (res.ok) return true;
    else return false;
  } catch (error) {
    console.error("Error getting user details:", error);
    throw new Error("No user details were found");
  }
}
