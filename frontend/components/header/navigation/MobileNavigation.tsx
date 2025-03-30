"use client";

import { useState } from "react";
import Link from "next/link";

import { ROUTES } from "@/utils/routes";

import { HiMenu } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";

import { OutsideClickContainer } from "@/components/outsideClick/OutsideClick";

export const MobileNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div>
        {isMenuOpen ? (
          <IoCloseOutline size={30} onClick={() => setIsMenuOpen(false)} />
        ) : (
          <HiMenu size={30} onClick={() => setIsMenuOpen(true)} />
        )}
      </div>

      <OutsideClickContainer
        onClose={() => setIsMenuOpen(false)}
        isOpen={isMenuOpen}
        className={`bg-dark700 top-header absolute left-0 z-[80] flex w-full flex-col p-4 transition-[height] delay-0 duration-300 ease-in-out ${
          isMenuOpen ? "h-screen pt-10 sm:h-auto sm:pt-4" : "h-0"
        }`}
      >
        <ul
          className={`flex flex-col items-center justify-center space-y-6 text-lg font-medium`}
        >
          {ROUTES.map((route) => (
            <li
              className="w-fit"
              onClick={() => setIsMenuOpen(false)}
              key={route.name}
            >
              <Link
                className="transition-[font-weight] delay-0 duration-75 ease-in-out hover:font-semibold"
                href={route.path}
              >
                {route.name}
              </Link>
            </li>
          ))}
        </ul>
      </OutsideClickContainer>
    </>
  );
};
