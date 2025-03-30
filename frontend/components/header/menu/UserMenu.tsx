import { verifySessionToken } from "@/lib/db/auth/actions";
import { getCookie } from "@/lib/db/auth/session";
import Link from "next/link";

import { FaUserCircle } from "react-icons/fa";
import { FiUser } from "react-icons/fi";

export const UserMenu = async () => {
  const cookie = await getCookie("session");
  const isLoggedIn = await verifySessionToken(cookie?.value ?? "");

  return (
    <Link href={"/dashboard/user"}>
      {!isLoggedIn && <FiUser size={24} className="cursor-pointer" />}
      {isLoggedIn && <FaUserCircle size={28} className="cursor-pointer" />}
    </Link>
  );
};
