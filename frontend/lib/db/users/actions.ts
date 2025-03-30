"use server";
import { revalidatePath } from "next/cache";

import { TUser } from "@/types/user.types";
import { getCookie } from "../auth/session";
import { serverFetch } from "..";

export const getCurrentUserFromServer = async () => {
  const cookie = await getCookie("session");
  if (!cookie?.value) return null;

  try {
    const res = await serverFetch(`/users/whoami`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${cookie?.name}=${cookie?.value}`,
      },
      cache: "no-store",
    });
    revalidatePath("/dashboard/user");

    return res;
  } catch (error) {
    console.error("Error getting user details:", error);
    throw new Error("No user details were found");
  }
};

export const getAllUsers = async () => {
  const cookie = await getCookie("session");
  if (!cookie?.value) throw new Error("No session was found");

  try {
    const res = await serverFetch(`/users`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${cookie?.name}=${cookie?.value}`,
      },
    });
    return (await res.json()) as TUser[];
  } catch (error) {
    console.error("Error getting user details:", error);
    return null;
  }
};
