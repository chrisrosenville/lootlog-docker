"use server";
import { cookies } from "next/headers";

import { TUser } from "@/types/user.types";
import { serverFetch } from "..";

export const getUserByIdAsAdmin = async (userId: number) => {
  try {
    const res = await serverFetch(`/users/${userId}`, {
      method: "GET",
      credentials: "include",
    });

    return await res.json();
  } catch (error) {
    console.error("Error getting user details:", error);
    return null;
  }
};

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  try {
    const res = await serverFetch(`/users/whoami`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${sessionCookie?.name}=${sessionCookie?.value};`,
      },
    });

    return await res.json();
  } catch (error) {
    console.error("Error getting user details:", error);
    throw new Error("No user details were found");
  }
};

export const checkAdminStatus = async () => {
  try {
    const res = await serverFetch(`/users/is-admin`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    return await res.json();
  } catch (error) {
    console.error("Error getting user details:", error);
    throw new Error("No user details were found");
  }
};

export const updateUser = async (user: Partial<TUser>) => {
  try {
    const res = await serverFetch(`/users/${user.id}`, {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await res.json();
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

export const deleteUser = async (userId: number) => {
  try {
    const res = await serverFetch(`/users/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });

    return await res.json();
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};
