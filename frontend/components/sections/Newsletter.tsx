import Image from "next/image";

import ControllerSvg from "@/public/game-controller-white.png";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const Newsletter = () => {
  return (
    <div className="flex flex-col rounded-md border border-orange700 bg-constellation p-8 shadow-sm lg:flex-row">
      <div className="relative min-h-16 w-full lg:w-2/5">
        <div className="absolute -top-3 flex h-full w-full items-center justify-center px-16 lg:top-0 lg:justify-end">
          <Image
            src={ControllerSvg}
            alt=""
            className="controller-shadow aspect-square h-16 w-16 -rotate-12 fill-white lg:h-32 lg:w-32"
          />
        </div>
      </div>
      <div className="text-neutral-100">
        <h2 className="drop text-center font-openSans text-2xl font-bold uppercase tracking-tight text-inherit lg:text-start">
          Subscribe to our newsletter
        </h2>
        <p className="text-center text-sm text-inherit lg:text-start">
          Stay up-to-date with the latest news, articles, and reviews.
        </p>
        <form className="mx-auto mt-3 max-w-[420px]" action="">
          <Input
            type="email"
            className="w-full rounded-md border-2 border-neutral-400 bg-neutral-50 px-4 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="Your email address"
          />
          <Button
            type="submit"
            className="mt-4 w-full rounded-md bg-orange700 px-4 py-2 text-white hover:bg-orange900"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </div>
  );
};
