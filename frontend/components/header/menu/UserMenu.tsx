"use client";
import Link from "next/link";

import { FaUserCircle } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { useAuthStore } from "@/store/auth-store";

export const UserMenu = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <Link href={"/dashboard"}>
      {!user && <FiUser size={24} className="cursor-pointer" />}
      {user && <FaUserCircle size={28} className="cursor-pointer" />}
    </Link>
  );
};
