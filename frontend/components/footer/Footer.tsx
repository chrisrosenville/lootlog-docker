import Link from "next/link";

import { FaFacebook, FaYoutube, FaTwitter } from "react-icons/fa";
import { FaPhone, FaLocationDot } from "react-icons/fa6";

import { ROUTES } from "@/utils/routes";
import { Logo } from "../logo/Logo";

export const Footer = () => {
  return (
    <footer>
      <div className="mx-auto flex max-w-siteWidth flex-col p-4">
        <div className="flex flex-col border-t border-neutral-500 pb-8 pt-16 md:flex-row">
          {/* Logo w. text */}
          <div className="flex flex-col items-center md:w-[40%] md:items-start">
            <Logo size="1.5rem" />
            <p className="text-sm italic">{`"Happy informed gaming"`}</p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col justify-evenly space-y-8 pt-8 md:w-[60%] md:flex-row md:space-x-8 md:space-y-0 md:py-0 md:pb-8">
            <div className="flex flex-col items-center">
              <h6 className="text-lg font-bold">Contact</h6>
              <ul className="mt-1 space-y-1 text-center font-light">
                <li>
                  <Link href="#">Email</Link>
                </li>
                <li>
                  <Link href="#">Phone</Link>
                </li>
                <li>
                  <Link href="#">Address</Link>
                </li>
                <li>
                  <Link href="#">Chatbot</Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <h6 className="text-lg font-bold">About us</h6>
              <ul className="mt-1 space-y-1 text-center font-light">
                <li>
                  <Link href="#">Authors</Link>
                </li>
                <li>
                  <Link href="#">FAQ</Link>
                </li>
                <li>
                  <Link href="#">Our articles</Link>
                </li>
                <li>
                  <Link href="#">Become an author</Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <h6 className="text-lg font-bold">Follow us</h6>
              <ul className="mt-1 space-y-1 text-center font-light">
                <li>
                  <Link href="#">Facebook</Link>
                </li>
                <li>
                  <Link href="#">Instagram</Link>
                </li>
                <li>
                  <Link href="#">Twitter</Link>
                </li>
                <li>
                  <Link href="#">TikTok</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[2px] w-full rounded-md bg-neutral-500"></div>

        <div className="flex flex-col justify-normal pb-4 pt-8 text-center md:flex-row md:justify-between md:text-start">
          <p className="font-bold">All rights reserved © 2025</p>
          <div className="flex flex-col items-center space-y-2 pt-8 text-sm font-light md:flex-row md:items-start md:space-x-4 md:space-y-0 md:pt-0">
            <div className="flex items-center space-x-1">
              <FaPhone />
              <p>+45 12345678</p>
            </div>
            <div className="flex items-center space-x-1">
              <FaLocationDot />
              <span className="">Aarhus, Denmark</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
