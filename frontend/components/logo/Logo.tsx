import Link from "next/link";
import { HTMLAttributes } from "react";

type Props = {
  size: string;
};

export const Logo = (props: Props) => {
  return (
    <Link className="flex w-fit" href="/">
      <h1
        className={`font-pressStart uppercase text-orange700`}
        style={{ fontSize: props.size }}
      >
        Loot
        <span
          className={`font-pressStart uppercase text-neutral-100`}
          style={{ fontSize: props.size }}
        >
          Log
        </span>
      </h1>
    </Link>
  );
};
